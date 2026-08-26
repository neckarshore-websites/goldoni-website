/**
 * Generates the print-ready QR code for the Wolt Storefront ordering page.
 *
 *   npm run qr:storefront
 *
 * WHY THIS IS A SCRIPT AND NOT A ONE-OFF DOWNLOAD
 *
 * Every URL here is DERIVED from src/lib/site.ts — the venue path from
 * `STOREFRONT_PARTNER.url`, the printed address from `ORDER_LANDING`, which is
 * itself built from `SITE.url`. A hand-made QR code is a second copy of a URL
 * that nobody can proofread: nothing about a printed square of pixels tells you
 * it points somewhere else than the button does. Deriving removes that failure
 * mode entirely, and the derivation is why no address in this file is typed out.
 *
 * This matters here specifically. Wolt's own activation mail shipped a
 * print-ready QR pointing at the /en/ variant for a venue in Stuttgart — the
 * exact class of mistake this script exists to prevent, made by the vendor.
 *
 * TWO DESTINATIONS SINCE 2026-08-26, and they are not interchangeable.
 * The print assets encode `ORDER_LANDING` — our own domain, which redirects to
 * the storefront with `utm_source=papier`. The mail asset encodes the storefront
 * directly with `utm_source=web`. Reasoning lives at ORDER_PATH in src/lib/site.ts;
 * the short version is that paper cannot be patched and a screen can.
 *
 * SO THE TWO PNGs NO LONGER AGREE, by design. They sit next to each other under
 * near-identical names and both are offered for download on /sandbox — pick the
 * wrong one for a flyer and the measurement lies without failing anything. The
 * download page labels them by channel for that reason.
 *
 * OUTPUTS
 * - public/images/storefront-qr.svg      — vector, print, -> ORDER_LANDING
 * - public/images/storefront-qr.png      — 2000 px raster, print, -> ORDER_LANDING
 *                                          (for tools that cannot place SVG)
 * - public/images/storefront-qr-mail.png — 440 px, e-mail signature, -> web marker
 * - scripts/storefront-qr.lock.json      — the URLs that were encoded. NOT served.
 *                                          A unit test compares them against
 *                                          site.ts, so changing an address without
 *                                          regenerating the assets fails CI instead
 *                                          of reaching a printer.
 *
 * ERROR CORRECTION level "H" (~30 % recoverable). Deliberate over the smaller
 * "M": these end up on paper — table cards, flyers, a window sticker — where
 * smudging, folding and a coffee ring are normal, and a reprint costs more than
 * the extra modules.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import QRCode from "qrcode";
import { ORDER_LANDING, storefrontUrl } from "../src/lib/site";

/** What gets printed. Our domain, so it can be repointed after the print run. */
const printUrl = ORDER_LANDING;
/** What goes into an e-mail signature. A screen, so it may point straight at Wolt. */
const mailUrl = storefrontUrl("web");
const root = process.cwd();

// Quiet zone of 4 modules is required by the spec — scanners need the margin to
// find the symbol. qrcode defaults to 4; stated explicitly so nobody "tidies"
// it to 0 to save space on a flyer.
const common = { errorCorrectionLevel: "H", margin: 4 } as const;

// Wrapped rather than top-level await: tsx transpiles this to CJS, where
// top-level await is not available.
async function main() {
  const svg = await QRCode.toString(printUrl, { ...common, type: "svg" });
  writeFileSync(join(root, "public/images/storefront-qr.svg"), svg, "utf8");

  const png = await QRCode.toBuffer(printUrl, {
    ...common,
    type: "png",
    width: 2000,
  });
  writeFileSync(join(root, "public/images/storefront-qr.png"), png);

  // Small raster for e-mail signatures. Mail clients cannot resize sensibly and
  // the file is fetched on every open by every recipient, so the 2000 px print
  // version is the wrong asset there — 440 px covers a ~110 px display box on a
  // retina screen at a fraction of the weight.
  const pngMail = await QRCode.toBuffer(mailUrl, {
    ...common,
    type: "png",
    width: 440,
  });
  writeFileSync(join(root, "public/images/storefront-qr-mail.png"), pngMail);

  writeFileSync(
    join(root, "scripts/storefront-qr.lock.json"),
    `${JSON.stringify({ printUrl, mailUrl, errorCorrectionLevel: common.errorCorrectionLevel }, null, 2)}\n`,
    "utf8",
  );

  console.log(`QR Druck  -> ${printUrl}`);
  console.log(`QR E-Mail -> ${mailUrl}`);
  console.log("  public/images/storefront-qr.svg       (Druck)");
  console.log("  public/images/storefront-qr.png       (Druck, 2000 px)");
  console.log("  public/images/storefront-qr-mail.png  (Signatur, 440 px)");
  console.log("  scripts/storefront-qr.lock.json       (Drift-Wächter)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
