/**
 * Builds the two review artifacts for the postcard drafts:
 *
 *   proof.html  — the A/B proof sheet with print guides and the text options
 *   print.html  — two A4 pages, white ground, cards only
 *
 *   node docs/postkarte/build.mjs
 *   node docs/postkarte/build.mjs --pdf     (also renders the PDF via Playwright)
 *
 * Fonts and QR codes are inlined so both files are self-contained and can be
 * mailed to the venue owner without anything breaking on the way.
 *
 * Run `npx tsx docs/postkarte/qr.ts` first — it writes the SVGs this reads, and
 * it is the step that proves the styled codes still scan.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");

const need = (p) => {
  if (!existsSync(p)) {
    console.error(`fehlt: ${p}`);
    if (p.endsWith(".svg")) console.error("  -> zuerst: npx tsx docs/postkarte/qr.ts");
    process.exit(1);
  }
  return p;
};

const b64 = (p) => readFileSync(need(p)).toString("base64");
const text = (p) => readFileSync(need(p), "utf8");

const subs = {
  __FONT_PLAYFAIR__: b64(join(root, "src/fonts/PlayfairDisplay-Subset.woff2")),
  __FONT_INTER__: b64(join(root, "src/fonts/Inter-Variable-subset.woff2")),
  __QR_A__: text(join(here, "qr-A.svg")),
  __QR_B__: text(join(here, "qr-B.svg")),
};

for (const name of ["proof", "print", "a6", "druck"]) {
  let html = text(join(here, `${name}.template.html`));
  for (const [key, value] of Object.entries(subs)) html = html.replace(key, value);

  const left = html.match(/__[A-Z_]+__/g);
  if (left) {
    console.error(`${name}: unaufgelöste Platzhalter -> ${[...new Set(left)].join(", ")}`);
    process.exit(1);
  }

  // Cheap structural guard. An unbalanced div silently collapses a card layout,
  // and the failure looks like a design decision rather than a bug.
  const open = (html.match(/<div\b/g) || []).length;
  const close = (html.match(/<\/div>/g) || []).length;
  if (open !== close) {
    console.error(`${name}: div-Bilanz ${open}/${close} — Markup ist kaputt`);
    process.exit(1);
  }

  writeFileSync(join(here, `${name}.html`), html);
  console.log(`${name}.html  (${(html.length / 1024).toFixed(0)} KB, divs ${open}/${close})`);
}

if (process.argv.includes("--pdf")) {
  const { chromium } = await import("@playwright/test");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${join(here, "print.html")}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: join(here, "goldoni-postkarte-entwuerfe.pdf"),
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log("goldoni-postkarte-entwuerfe.pdf");

  await page.goto(`file://${join(here, "a6.html")}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: join(here, "goldoni-postkarte-a6.pdf"),
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log("goldoni-postkarte-a6.pdf");

  // Druckdaten: zwei Seiten zu je 154 x 111 mm. preferCSSPageSize traegt die
  // @page-Groesse aus dem Stylesheet in das PDF — ohne sie faellt Chromium
  // auf A4 zurueck und die Datei waere fuer die Druckerei unbrauchbar.
  await page.goto(`file://${join(here, "druck.html")}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: join(here, "goldoni-postkarte-a6-druckdaten.pdf"),
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log("goldoni-postkarte-a6-druckdaten.pdf");

  await browser.close();
}
