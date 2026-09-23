import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildLlmsTxt, hoursLine } from "../../src/lib/llms";
import { SITE } from "../../src/lib/site";
import sitemap from "../../src/app/sitemap";
import empfehlungskarte from "../../src/data/empfehlungskarte.json";

/**
 * llms.txt is what AI engines quote to guests. The hand-written file of
 * 2026-04-29 drifted for five months (wrong opening hours) because nothing
 * compared it to the site. These checks bind both language variants to the
 * data the pages render.
 */

let checks = 0;
function check(name: string, fn: () => void): void {
  fn();
  checks++;
  console.log(`ok - ${name}`);
}

const de = buildLlmsTxt("de");
const en = buildLlmsTxt("en");

for (const [lang, txt] of [["de", de], ["en", en]] as const) {
  check(`${lang}: llmstxt.org shape — H1, then blockquote summary`, () => {
    const lines = txt.split("\n");
    assert.equal(lines[0], `# ${SITE.name}`);
    assert.ok(lines[2].startsWith("> "), "second block must be the > summary");
  });
  check(`${lang}: opening hours come from SITE.hours`, () => {
    assert.ok(txt.includes(hoursLine(lang)));
    for (const h of SITE.hours) {
      if (h.time === "geschlossen") continue;
      for (const t of h.time.split(/\s*-\s*|\s*&\s*/)) assert.ok(txt.includes(t), `${t} missing`);
    }
  });
  check(`${lang}: every dish of the weekly menu is listed`, () => {
    for (const c of empfehlungskarte.categories)
      for (const it of c.items) assert.ok(txt.includes(it.name), `${it.name} missing`);
  });
  check(`${lang}: contact facts from SITE`, () => {
    for (const f of [SITE.phone, SITE.email, SITE.address.street]) assert.ok(txt.includes(f), `${f} missing`);
  });
  check(`${lang}: every site link is a sitemap route or the sibling llms file`, () => {
    const routes = new Set(sitemap().map((e) => e.url.replace(/\/$/, "")));
    routes.add(`${SITE.url}/llms.txt`).add(`${SITE.url}/llms-en.txt`);
    const links = [...txt.matchAll(/\]\((https:\/\/ristorante-goldoni\.de[^)]*)\)/g)].map((m) => m[1].replace(/\/$/, ""));
    assert.ok(links.length >= 8, "too few links parsed");
    for (const l of links) assert.ok(routes.has(l), `link not in sitemap: ${l}`);
  });
  check(`${lang}: no placeholder leaks, no ASCII umlaut spellings`, () => {
    assert.ok(!/undefined|NaN|\[object/.test(txt));
    assert.ok(!/Kueche|Oeffnung|Uhrzeit ueber/.test(txt));
  });
}

check("the weekly menu date is the card's date", () => {
  const [y, m, d] = empfehlungskarte.updated.split("-");
  assert.ok(de.includes(`${d}.${m}.${y}`));
  assert.ok(en.includes(empfehlungskarte.updated));
});

check("no hand-written public/llms.txt shadows the generated route", () => {
  assert.throws(() => readFileSync(join(process.cwd(), "public/llms.txt")));
});

check("sitemap: lastmod only on the weekly menu, and it is the card's date", () => {
  for (const e of sitemap()) {
    if (e.url.endsWith("/empfehlungen")) assert.equal(e.lastModified, empfehlungskarte.updated);
    else assert.equal(e.lastModified, undefined, `${e.url} carries a lastmod without a maintained date`);
  }
});

console.log(`\n${checks} checks passed`);
console.log(`${checks} passed, 0 failed`);
