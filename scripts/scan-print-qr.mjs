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
 * herausgibt. Seiten ohne QR (Vorderseiten) stehen nicht in der Liste; ein
 * fehlender Code dort waere kein Befund, sondern die Gestaltung.
 */
const PRINT_PDFS = [
  { label: "Postkarte Rueckseite", path: "public/assets/print/goldoni-postkarte-a6-druckdaten.pdf", seite: 2 },
  { label: "Bierdeckel Rueckseite", path: "public/assets/print/goldoni-bierdeckel-druckdaten.pdf", seite: 2 },
  { label: "Pizzakarton Deckel", path: "public/assets/print/goldoni-pizzakarton-deckel-druckdaten.pdf", seite: 1 },
];

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

  for (const { label, path, seite } of PRINT_PDFS) {
    const stem = join(dir, path.replace(/[^a-z0-9]/gi, "-"));
    // 300 dpi: nah an dem, was eine Kamera von einer gedruckten Flaeche aufloest,
    // und hoch genug, dass die Rasterung nicht selbst zum Befund wird.
    spawnSync("pdftoppm", ["-r", "300", "-png", "-singlefile", "-f", String(seite), "-l", String(seite), path, stem], { stdio: "ignore" });
    args.push(`${label}=${stem}.png`);
  }

  const res = spawnSync("swift", ["scripts/scan-print-qr.swift", ...args], {
    stdio: "inherit",
  });
  if (res.error) {
    console.error(
      "swift nicht ausfuehrbar — dieses Tor braucht macOS mit Xcode-Kommandozeilenwerkzeugen.",
    );
    process.exit(1);
  }
  process.exit(res.status ?? 1);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
