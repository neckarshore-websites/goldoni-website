import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { PNG } from "pngjs";
import jsQR from "jsqr";
import { ORDER_LANDING, STOREFRONT_PARTNER, storefrontUrl } from "../../src/lib/site";

/**
 * Proves the COMMITTED QR asset resolves to the ordering URL the website uses.
 *
 * Why decode the image instead of trusting the generator: the generator's own
 * sidecar (scripts/storefront-qr.lock.json) only records what it was ASKED to
 * encode. It says nothing about what ended up in the pixels. For an asset whose
 * whole purpose is to be printed — where a mistake is not patchable — the check
 * has to read the artifact itself.
 *
 * The failure this prevents is not hypothetical. Wolt shipped Ristorante
 * Goldoni a print-ready QR pointing at the /en/ page for a venue in Stuttgart.
 * A vendor with far more resources made exactly this mistake in exactly this
 * artifact, which is why it is worth a test rather than a careful eye.
 */

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

const root = process.cwd();
const pngPath = join(root, "public/images/storefront-qr.png");
const svgPath = join(root, "public/images/storefront-qr.svg");
const lockPath = join(root, "scripts/storefront-qr.lock.json");

check("QR assets are committed", () => {
  for (const p of [pngPath, svgPath, lockPath]) {
    assert.ok(existsSync(p), `missing ${p} — run: npm run qr:storefront`);
  }
});

check("the print PNG decodes to the PRINTED ordering address", () => {
  const png = PNG.sync.read(readFileSync(pngPath));
  const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  // Non-vacuity: a null result must fail loudly rather than skip the compare.
  assert.ok(
    decoded,
    "no QR code found in the PNG — the asset is unreadable, not merely wrong",
  );
  assert.equal(
    decoded.data,
    ORDER_LANDING,
    "the print asset points somewhere other than the ordering path this site serves",
  );
});

check("the mail-sized PNG decodes to the WEB-marked storefront address", () => {
  // Separate asset, separate chance to drift. It is embedded in e-mail
  // signatures by absolute URL, so a wrong one would go out with every message
  // Silvio sends and could not be recalled.
  const mailPath = join(root, "public/images/storefront-qr-mail.png");
  assert.ok(existsSync(mailPath), `missing ${mailPath} — run: npm run qr:storefront`);
  const png = PNG.sync.read(readFileSync(mailPath));
  const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  assert.ok(decoded, "no QR code found in the mail-sized PNG");
  // DELIBERATELY NOT the same URL as the print asset since 2026-08-26. A signature is a
  // screen, so it may point straight at the partner and carry the web marker; only paper
  // needs the repointable detour. Two near-identical filenames, two destinations — this
  // assertion is what keeps that from being an accident.
  assert.equal(decoded.data, storefrontUrl("web"));
});

check("the venue path is still the /de/ variant", () => {
  // Wolt's own mail, PDF and QR all carry /en/ for a German venue. Guard the
  // deliberate deviation so a future regeneration cannot quietly adopt theirs.
  // Asserted on the canonical constant, not on the lock: since the print asset moved to
  // our own domain it no longer contains a locale at all, and testing the lock's print
  // entry for /de/ would have been a check that passes by looking somewhere else.
  assert.match(STOREFRONT_PARTNER.url, /\/de\//, "URL is not the German locale");
  assert.doesNotMatch(STOREFRONT_PARTNER.url, /\/en\//, "URL fell back to the English locale");
});

check("lock file agrees with site.ts (assets were regenerated)", () => {
  const lock = JSON.parse(readFileSync(lockPath, "utf8")) as {
    printUrl: string;
    mailUrl: string;
  };
  assert.equal(
    lock.printUrl,
    ORDER_LANDING,
    "site.ts changed but the print QR was not regenerated — run: npm run qr:storefront",
  );
  assert.equal(
    lock.mailUrl,
    storefrontUrl("web"),
    "site.ts changed but the mail QR was not regenerated — run: npm run qr:storefront",
  );
});

check("error correction is print-grade", () => {
  const lock = JSON.parse(readFileSync(lockPath, "utf8")) as {
    errorCorrectionLevel: string;
  };
  // "H" tolerates ~30 % damage. Paper gets folded, smudged and rained on.
  assert.equal(lock.errorCorrectionLevel, "H");
});

console.log(`\nstorefront QR: ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
