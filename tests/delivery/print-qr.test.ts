import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ORDER_LANDING, ORDER_PATH } from "../../src/lib/site";

/**
 * Guards what CI CAN honestly guard about the print QR artifacts — and deliberately does
 * not pretend to guard the rest.
 *
 * WHAT IT DOES NOT CHECK, AND WHY THAT IS STATED HERE RATHER THAN QUIETLY OMITTED:
 * whether the codes actually SCAN. jsQR — the only decoder available on the Linux runner —
 * cannot read these styled codes even when they are correct and phones read them
 * instantly. A decode assertion here would therefore be either impossible or, worse,
 * passable by decoding a re-drawn approximation instead of the delivered artifact.
 *
 * That is not hypothetical. It is exactly what `docs/postkarte/qr.ts` does, and on
 * 2026-08-26 it stayed green for months over finder patterns drawn half a module off —
 * a defect that made the emitted code unreadable to every phone the moment the matrix got
 * small enough to stop being forgiving.
 *
 * Readability is therefore gated OUTSIDE CI, by `npm run pruef:druck-qr` (macOS, Apple
 * Vision) plus a real phone on a real proof, before any print order.
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
