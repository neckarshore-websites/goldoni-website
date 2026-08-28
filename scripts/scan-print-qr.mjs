/**
 * Pre-print readability gate for every QR code this repo puts on paper.
 *
 *     npm run pruef:druck-qr
 *
 * Renders the committed SVGs and hands the pixels to Apple's Vision decoder — the engine
 * behind the iPhone camera — via `scripts/scan-print-qr.swift`. Fails if any artifact does
 * not scan, or scans to the wrong address.
 *
 * WHY IT IS A SEPARATE GATE AND NOT PART OF `npm test`: it needs macOS. CI runs on Linux,
 * where Vision does not exist and the only available decoder (jsQR) cannot read these
 * styled codes at all — not even the ones phones read instantly. So CI checks the
 * constants, the lock file and the geometry, and deliberately makes no claim about
 * scannability. This script is where that claim gets earned, and it has to be run by a
 * human before a print order.
 *
 * The reason it exists at all is written out in the Swift file: on 2026-08-26 shortening
 * the printed address shrank the matrix from 49x49 to 37x37 and exposed a half-module
 * error in the finder-pattern geometry that had been there all along. Every phone failed
 * on the code while the generator's own check stayed green, because that check builds its
 * own picture instead of reading the delivered one.
 *
 * ALSO RENDERS AT A DELIBERATELY MODEST SIZE. 600 px is close to what a phone actually
 * resolves off a postcard held at arm's length — verifying only at 1600 px would pass
 * codes that are marginal in the hand.
 */
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { ORDER_LANDING } from "../src/lib/site.ts";

/** viewBox edge of the styled artifacts: 49 modules + 2x4 quiet zone. */
const VIEWBOX = 57;
const RENDER_PX = 600;

const ARTIFACTS = [
  { label: "Postkarte/Bierdeckel Variante A", path: "docs/postkarte/qr-A.svg" },
  { label: "Postkarte/Bierdeckel Variante B", path: "docs/postkarte/qr-B.svg" },
  { label: "Druck-QR (Flyer, Aufkleber)", path: "public/images/storefront-qr.svg" },
];

/**
 * DIE AUSGELIEFERTEN DRUCKDATEN, und sie stehen aus einem bestimmten Grund hier.
 *
 * Die SVGs oben sind die Quelle; diese PDFs sind, was ein Mensch an eine Druckerei
 * schickt. Am 26.08.2026 waren die beiden fuer zwoelf Stunden auseinander — die
 * Quelle war repariert, das Ausgelieferte trug noch den unlesbaren Code, und jede
 * Pruefung zeigte auf die falsche Seite dieser Luecke. Ein Tor, das nur die Quelle
 * liest, haette das wieder nicht gesehen.
 *
 * Geprueft wird deshalb `public/assets/print` — die Kopie, die die Website
 * herausgibt.
 *
 * KEINE FESTE SEITENZAHL MEHR, und das ist der zweite Fehler derselben Familie.
 * Bis zum 28.08.2026 stand hier `seite: 2` fuer die Postkarte. Dann tauschte der
 * Betreiber die Seitenreihenfolge der Druckdatei — eine voellig legitime, rein
 * inhaltliche Aenderung — und das Tor durchsuchte die Einladungsseite, fand dort
 * naturgemaess keinen Code und meldete "NICHT LESBAR — darf nicht in den Druck".
 * Ein roter Alarm auf einer einwandfreien Datei, unmittelbar vor einer Bestellung.
 *
 * Jetzt werden ALLE Seiten jeder Datei gelesen, und die Forderung lautet: genau
 * eine Seite traegt einen lesbaren Code, und der zeigt auf die richtige Adresse.
 * Damit ist die Pruefung gegen Seitenvertauschungen immun, und sie sagt zusaetzlich,
 * AUF WELCHER Seite der Code sitzt — wandert er, sieht man es, statt es zu raten.
 * Seiten ohne Code sind erwartet (Vorderseiten) und kein Befund.
 *
 * Grenze, benannt statt verschwiegen: eine Seite ohne Code und eine Seite mit
 * kaputtem Code sind fuer den Decoder ununterscheidbar. Deshalb ist "null lesbare
 * Seiten" ein Fehlschlag — ein kaputter Code kann so nie gruen werden. Traegt eine
 * Datei zwei Codes und einer ist kaputt, faellt das hier nicht auf; dieser Fall
 * existiert im Bestand nicht und wuerde die Pruefung teurer machen als sie nuetzt.
 */
const PRINT_PDFS = [
  { label: "Postkarte", path: "public/assets/print/goldoni-postkarte-a6-druckdaten.pdf" },
  { label: "Bierdeckel", path: "public/assets/print/goldoni-bierdeckel-druckdaten.pdf" },
  { label: "Pizzakarton Deckel", path: "public/assets/print/goldoni-pizzakarton-deckel-druckdaten.pdf" },
];

/** Seitenzahl einer PDF-Datei — gelesen, nicht angenommen. */
function seitenzahl(path) {
  const info = spawnSync("pdfinfo", [path], { encoding: "utf8" });
  const m = /^Pages:\s+(\d+)$/m.exec(info.stdout ?? "");
  if (!m) throw new Error(`Seitenzahl von ${path} nicht lesbar — pdfinfo fehlt oder die Datei ist defekt.`);
  return Number(m[1]);
}

const dir = mkdtempSync(join(tmpdir(), "druck-qr-"));
try {
  const args = [ORDER_LANDING];
  for (const { label, path } of ARTIFACTS) {
    const out = join(dir, `${path.replace(/[^a-z0-9]/gi, "-")}.png`);
    await sharp(readFileSync(path), { density: (72 * RENDER_PX) / VIEWBOX })
      .resize(RENDER_PX, RENDER_PX, { fit: "fill" })
      // Flatten onto white: an alpha channel left in place reads as dark and would fail
      // for a reason that has nothing to do with the code.
      .flatten({ background: "#ffffff" })
      .png()
      .toFile(out);
    args.push(`${label}=${out}`);
  }

  // Jede Seite jeder Druckdatei wird ein eigenes Artefakt. Die Gruppenlogik unten
  // entscheidet danach, was ein Befund ist und was blosse Vorderseite.
  const gruppen = new Map();
  for (const { label, path } of PRINT_PDFS) {
    const n = seitenzahl(path);
    gruppen.set(label, []);
    for (let seite = 1; seite <= n; seite++) {
      const stem = join(dir, `${path.replace(/[^a-z0-9]/gi, "-")}-s${seite}`);
      // 300 dpi: nah an dem, was eine Kamera von einer gedruckten Flaeche aufloest,
      // und hoch genug, dass die Rasterung nicht selbst zum Befund wird.
      spawnSync("pdftoppm", ["-r", "300", "-png", "-singlefile", "-f", String(seite), "-l", String(seite), path, stem], { stdio: "ignore" });
      const artefakt = `${label} Seite ${seite}`;
      gruppen.get(label).push(artefakt);
      args.push(`${artefakt}=${stem}.png`);
    }
  }

  const res = spawnSync("swift", ["scripts/scan-print-qr.swift", ...args], {
    encoding: "utf8",
  });
  if (res.error) {
    console.error(
      "swift nicht ausfuehrbar — dieses Tor braucht macOS mit Xcode-Kommandozeilenwerkzeugen.",
    );
    process.exit(1);
  }
  const ausgabe = `${res.stdout ?? ""}${res.stderr ?? ""}`;

  // Zeilen des Decoders auswerten statt nur seinen Rueckgabewert zu nehmen: eine
  // Seite ohne Code ist fuer ihn ein Fehlschlag, fuer uns die Vorderseite.
  const gelesen = new Map();
  const falschesZiel = [];
  for (const zeile of ausgabe.split("\n")) {
    const ok = /^\s*✓ (.+?) -> (.+)$/.exec(zeile);
    if (ok) gelesen.set(ok[1], ok[2]);
    const zeigtAuf = /^\s*✗ (.+?): zeigt auf (.+)$/.exec(zeile);
    if (zeigtAuf) falschesZiel.push(`${zeigtAuf[1]} — ${zeigtAuf[2]}`);
  }

  let fehler = 0;
  for (const { label } of ARTIFACTS) {
    if (gelesen.has(label)) console.log(`  ✓ ${label} -> ${gelesen.get(label)}`);
    else { console.log(`  ✗ ${label}: NICHT LESBAR — dieser Code darf nicht in den Druck`); fehler++; }
  }
  for (const [label, artefakte] of gruppen) {
    const treffer = artefakte.filter((a) => gelesen.has(a));
    if (treffer.length === 1) {
      const seite = treffer[0].slice(label.length + 1);
      console.log(`  ✓ ${label} (${seite}) -> ${gelesen.get(treffer[0])}`);
    } else if (treffer.length === 0) {
      console.log(`  ✗ ${label}: auf KEINER der ${artefakte.length} Seiten ein lesbarer Code — darf nicht in den Druck`);
      fehler++;
    } else {
      console.log(`  ✗ ${label}: ${treffer.length} Seiten tragen einen Code, erwartet genau eine`);
      fehler++;
    }
  }
  for (const treffer of falschesZiel) {
    console.log(`  ✗ ${treffer} — falsches Ziel`);
    fehler++;
  }

  const gesamt = ARTIFACTS.length + gruppen.size;
  console.log(`\nDruck-QR (Apple Vision): ${gesamt - fehler} von ${gesamt} in Ordnung`);
  process.exit(fehler > 0 ? 1 : 0);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
