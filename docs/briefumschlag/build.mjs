/**
 * Baut Kontrollbogen und Druckdaten fuer den Briefumschlag.
 *
 *   node docs/briefumschlag/build.mjs --pdf
 *
 * Kein QR-Code, und der Grund hat sich nicht geaendert, obwohl die Farbigkeit es hat:
 * ein Bestellweg gehoert auf das, was drin liegt, nicht auf die Huelle.
 *
 * ACHTUNG, DIE ENTSCHEIDUNG IST DIESER DATEI VORAUS. Der Betreiber hat am 2026-08-25
 * auf 4/4 (vierfarbig beidseitig) entschieden; dieses Skript erzeugt weiterhin EINE
 * Seite, einfarbig schwarz. Der Kommentar sagte bis dahin schlicht "1/0" und stimmte
 * damit mit der Datei, aber nicht mehr mit der Absicht ueberein.
 * Nicht stillschweigend nachgezogen: aus 1/0 einseitig 4/4 beidseitig zu machen ist
 * Gestaltungsarbeit an zwei Flaechen, keine Umstellung eines Schalters — und
 * Gestaltung nimmt hier der Betreiber ab, nicht das Bauskript.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const need = (p) => {
  if (!existsSync(p)) { console.error(`fehlt: ${p}`); process.exit(1); }
  return p;
};
const b64 = (p) => readFileSync(need(p)).toString("base64");
const text = (p) => readFileSync(need(p), "utf8");

const subs = {
  __FONT_PLAYFAIR__: b64(join(root, "src/fonts/PlayfairDisplay-Subset.woff2")),
  __FONT_INTER__: b64(join(root, "src/fonts/Inter-Variable-subset.woff2")),
};

for (const name of ["print", "druck"]) {
  let html = text(join(here, `${name}.template.html`));
  for (const [key, value] of Object.entries(subs)) html = html.replaceAll(key, value);
  const left = html.match(/__[A-Z_]+__/g);
  if (left) { console.error(`${name}: offene Platzhalter ${[...new Set(left)].join(", ")}`); process.exit(1); }
  const open = (html.match(/<div\b/g) || []).length;
  const close = (html.match(/<\/div>/g) || []).length;
  if (open !== close) { console.error(`${name}: div-Bilanz ${open}/${close}`); process.exit(1); }
  writeFileSync(join(here, `${name}.html`), html);
  console.log(`${name}.html  (${(html.length / 1024).toFixed(0)} KB, divs ${open}/${close})`);
}

if (process.argv.includes("--pdf")) {
  const { chromium } = await import("@playwright/test");
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`file://${join(here, "print.html")}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: join(here, "goldoni-briefumschlag-entwurf.pdf"), format: "A4",
    landscape: true, printBackground: true, preferCSSPageSize: true });
  console.log("goldoni-briefumschlag-entwurf.pdf");

  await page.goto(`file://${join(here, "druck.html")}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: join(here, "goldoni-briefumschlag-druckdaten.pdf"),
    printBackground: true, preferCSSPageSize: true });
  console.log("goldoni-briefumschlag-druckdaten.pdf");

  await browser.close();
}
