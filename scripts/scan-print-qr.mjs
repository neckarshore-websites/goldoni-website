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
 * the printed address shrank the matrix from 49x49 to 37x37 and made the styled code
 * unscannable, while the generator's own check stayed green because it decodes a
 * square-eyed approximation rather than the artifact.
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
