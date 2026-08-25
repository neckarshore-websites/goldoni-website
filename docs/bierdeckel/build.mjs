/**
 * Baut den Kontrollbogen fuer den Bierdeckel-Entwurf.
 *
 *   node docs/bierdeckel/build.mjs
 *   node docs/bierdeckel/build.mjs --pdf
 *
 * Schriften und QR-Code werden eingebettet, damit die Datei allein
 * weitergegeben werden kann.
 *
 * Der QR-Code kommt aus docs/postkarte/qr-A.svg — DERSELBE Code wie auf der
 * Postkarte, erzeugt aus STOREFRONT_PARTNER.url und beim Erzeugen wieder
 * eingelesen. Fehlt er, zuerst: npx tsx docs/postkarte/qr.ts
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
  __QR__: text(join(root, "docs/postkarte/qr-A.svg")),
};

for (const name of ["print", "druck"]) {
let html = text(join(here, `${name}.template.html`));
for (const [key, value] of Object.entries(subs)) html = html.replaceAll(key, value);

const left = html.match(/__[A-Z_]+__/g);
if (left) {
  console.error(`unaufgeloeste Platzhalter -> ${[...new Set(left)].join(", ")}`);
  process.exit(1);
}

const open = (html.match(/<div\b/g) || []).length;
const close = (html.match(/<\/div>/g) || []).length;
if (open !== close) {
  console.error(`div-Bilanz ${open}/${close} — Markup ist kaputt`);
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
    path: join(here, "goldoni-bierdeckel-entwurf.pdf"),
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log("goldoni-bierdeckel-entwurf.pdf");

  await page.goto(`file://${join(here, "druck.html")}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: join(here, "goldoni-bierdeckel-druckdaten.pdf"),
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log("goldoni-bierdeckel-druckdaten.pdf");

  await browser.close();
}
