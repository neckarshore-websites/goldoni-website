import assert from "node:assert/strict";
import MiniSearch from "minisearch";
import { buildSearchDocs, slugify } from "../../src/lib/search/index-data";

let pass = 0,
  fail = 0;
function check(label: string, fn: () => void) {
  try {
    fn();
    pass++;
  } catch (e) {
    fail++;
    console.error(`  ✗ ${label}\n    ${(e as Error).message.split("\n")[0]}`);
  }
}

const docs = buildSearchDocs();

check("covers every content type", () => {
  for (const t of ["page", "menu", "empfehlung", "wine", "faq"]) {
    assert.ok(docs.some((d) => d.type === t), `missing type ${t}`);
  }
});
check("page docs include the key routes", () => {
  for (const url of ["/", "/menu", "/empfehlungen", "/feiern", "/ueber-uns", "/kontakt", "/impressum", "/datenschutz"]) {
    assert.ok(docs.find((d) => d.type === "page" && d.url === url), `missing page ${url}`);
  }
});
check("menu items deep-link to /menu#<category>", () => {
  const item = docs.find((d) => d.type === "menu");
  assert.ok(item && /^\/menu#[a-z0-9-]+$/.test(item.url), item?.url);
});
check("empfehlung items deep-link to /empfehlungen#<category>", () => {
  const item = docs.find((d) => d.type === "empfehlung");
  assert.ok(item && /^\/empfehlungen#[a-z0-9-]+$/.test(item.url), item?.url);
});
check("faq url is /#<slug> matching slugify(question)", () => {
  const faq = docs.find((d) => d.type === "faq");
  assert.ok(faq && faq.url === `/#${slugify(faq.title)}`, faq?.url);
});
check("all ids are unique", () => {
  const ids = docs.map((d) => d.id);
  assert.equal(new Set(ids).size, ids.length);
});
check("minisearch finds a dish (fuzzy/prefix)", () => {
  const mini = new MiniSearch({ fields: ["title", "text"], storeFields: ["url", "type"] });
  mini.addAll(docs);
  const hits = mini.search("vitello", { fuzzy: 0.2, prefix: true });
  assert.ok(hits.some((h) => String(h.url).startsWith("/menu")), "no /menu hit for 'vitello'");
});
check("minisearch finds a FAQ by topic", () => {
  const mini = new MiniSearch({ fields: ["title", "text"], storeFields: ["url", "type"] });
  mini.addAll(docs);
  const hits = mini.search("reservieren", { fuzzy: 0.2, prefix: true });
  assert.ok(hits.some((h) => h.type === "faq"), "no FAQ hit for 'reservieren'");
});
check("minisearch finds a wine", () => {
  const mini = new MiniSearch({ fields: ["title", "text"], storeFields: ["url", "type"] });
  mini.addAll(docs);
  const hits = mini.search("antinori", { fuzzy: 0.2, prefix: true });
  assert.ok(hits.some((h) => h.type === "wine"), "no wine hit for 'antinori'");
});

console.log(`index-data: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
