/**
 * Generates the print-ready QR code for the Wolt Storefront ordering page.
 *
 *   npm run qr:storefront
 *
 * WHY THIS IS A SCRIPT AND NOT A ONE-OFF DOWNLOAD
 *
 * The URL is read from `STOREFRONT_PARTNER.url` in src/lib/site.ts — the same
 * constant the website links to. A hand-made QR code is a second copy of the
 * URL that nobody can proofread: nothing about a printed square of pixels tells
 * you it points somewhere else than the button does. Generating it from the
 * single source removes that failure mode entirely.
 *
 * This matters here specifically. Wolt's own activation mail shipped a
 * print-ready QR pointing at the /en/ variant for a venue in Stuttgart — the
 * exact class of mistake this script exists to prevent, made by the vendor.
 *
 * OUTPUTS
 * - public/images/storefront-qr.svg  — vector, for layout and any print size
 * - public/images/storefront-qr.png  — 2000 px raster, for tools that cannot
 *                                      place SVG (flyer templates, Word, Canva)
 * - scripts/storefront-qr.lock.json  — the URL that was encoded. NOT served.
 *                                      A unit test compares it against site.ts,
 *                                      so changing the URL without regenerating
 *                                      the asset fails CI instead of reaching a
 *                                      printer.
 *
 * ERROR CORRECTION level "H" (~30 % recoverable). Deliberate over the smaller
 * "M": these end up on paper — table cards, flyers, a window sticker — where
 * smudging, folding and a coffee ring are normal, and a reprint costs more than
 * the extra modules.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import QRCode from "qrcode";
import { STOREFRONT_PARTNER } from "../src/lib/site";

const url = STOREFRONT_PARTNER.url;
const root = process.cwd();

// Quiet zone of 4 modules is required by the spec — scanners need the margin to
// find the symbol. qrcode defaults to 4; stated explicitly so nobody "tidies"
// it to 0 to save space on a flyer.
const common = { errorCorrectionLevel: "H", margin: 4 } as const;

// Wrapped rather than top-level await: tsx transpiles this to CJS, where
// top-level await is not available.
async function main() {
  const svg = await QRCode.toString(url, { ...common, type: "svg" });
  writeFileSync(join(root, "public/images/storefront-qr.svg"), svg, "utf8");

  const png = await QRCode.toBuffer(url, {
    ...common,
    type: "png",
    width: 2000,
  });
  writeFileSync(join(root, "public/images/storefront-qr.png"), png);

  // Small raster for e-mail signatures. Mail clients cannot resize sensibly and
  // the file is fetched on every open by every recipient, so the 2000 px print
  // version is the wrong asset there — 440 px covers a ~110 px display box on a
  // retina screen at a fraction of the weight.
  const pngMail = await QRCode.toBuffer(url, {
    ...common,
    type: "png",
    width: 440,
  });
  writeFileSync(join(root, "public/images/storefront-qr-mail.png"), pngMail);

  writeFileSync(
    join(root, "scripts/storefront-qr.lock.json"),
    `${JSON.stringify({ url, errorCorrectionLevel: common.errorCorrectionLevel }, null, 2)}\n`,
    "utf8",
  );

  console.log(`QR erzeugt für: ${url}`);
  console.log("  public/images/storefront-qr.svg");
  console.log("  public/images/storefront-qr.png  (2000 px)");
  console.log("  scripts/storefront-qr.lock.json  (Drift-Wächter)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
