import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ORDER_LANDING, ORDER_PATH } from "../../src/lib/site";

/**
 * Guards what CI CAN honestly guard about the print QR artifacts — and deliberately does
 * not pretend to guard the rest.
 *
 * WHAT IT DOES NOT CHECK, AND WHY THAT IS STATED HERE RATHER THAN QUIETLY OMITTED:
 * whether the codes actually SCAN. Measured 2026-08-26 against Apple's Vision decoder,
 * single-render, with a control:
 *
 *   plain unstyled QR, same payload -> reads at 4, 8, 16, 24, 32, 40 px per module
 *   the styled postcard/beermat QR  -> reads at none of them
 *
 * jsQR — the only decoder available on the Linux runner — cannot read the styled codes
 * either, including ones that phones read instantly. So a decode assertion in CI would be
 * either impossible or, worse, passable by decoding a squared-up approximation of the
 * artifact instead of the artifact. That is precisely the mistake already sitting in
 * `docs/postkarte/qr.ts`: its self-check rasterises the finder eyes as squares, and it
 * stayed green while the emitted code was unreadable.
 *
 * Readability is therefore gated OUTSIDE CI, by `npm run pruef:druck-qr` (macOS, Apple
 * Vision) plus a real phone on a real proof, before any print order. A red gate there is
 * the current state of the styled variants and is not a defect in this file.
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
const ARTIFACTS = [
  "docs/postkarte/qr-A.svg",
  "docs/postkarte/qr-B.svg",
  "public/images/storefront-qr.svg",
];

for (const rel of ARTIFACTS) {
  check(`${rel} liegt im Repo`, () => {
    assert.ok(
      existsSync(join(root, rel)),
      `missing ${rel} — run: npx tsx docs/postkarte/qr.ts`,
    );
  });
}

check("die gedruckte Adresse liegt auf unserer eigenen Domain", () => {
  // The property the whole construction exists to buy: paper we can repoint. An edit that
  // puts the partner address back onto the card must fail here, not at a printer.
  assert.match(
    ORDER_LANDING,
    /^https:\/\/ristorante-goldoni\.de\//,
    "printed address left our own domain — repointability is gone the moment it does",
  );
});

check("gedruckte Adresse und bedienter Pfad passen zusammen", () => {
  assert.ok(
    ORDER_LANDING.endsWith(ORDER_PATH),
    `printed address ${ORDER_LANDING} does not end in the served path ${ORDER_PATH}`,
  );
});

check("kein gestyltes SVG traegt noch die alte Partner-Adresse", () => {
  // Cheap staleness catch. The generator embeds no URL text in the SVG, so this cannot
  // prove the code is current — but a leftover artifact from a hand edit would show up.
  for (const rel of ARTIFACTS) {
    const svg = readFileSync(join(root, rel), "utf8");
    assert.doesNotMatch(
      svg,
      /order\.site/,
      `${rel} contains the partner address as text — it should encode ours`,
    );
  }
});

console.log(`\nprint QR (Bestand + Adresse): ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
