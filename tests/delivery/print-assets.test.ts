import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { basename, join } from "node:path";
import { GENERATED } from "../../scripts/sync-print-assets.mjs";

/**
 * Proves the print PDFs the website SERVES are the ones the build produced.
 *
 * THE FAILURE THIS CATCHES ACTUALLY HAPPENED, on 2026-08-26, and it is the reason the file
 * exists. The generated PDFs live next to their build scripts in `docs/`; the /assets pages
 * serve copies from `public/assets/print`. Nothing connected the two — a human carried them
 * across. So after a QR fix was built and verified, the served pair stayed 12 hours old and
 * still carried the broken code. Every check that was run pointed at the fresh file. The
 * website pointed at the other one.
 *
 * That is the third instance of one shape in a single day: a guard that inspects something
 * adjacent to the artifact that ships. The generator's self-check rebuilt its own picture
 * instead of reading the delivered SVG; the readability gate was pointed at the build
 * output; and the copy step did not exist at all. Byte equality is the cheapest possible
 * answer to all three — it cannot be satisfied by looking at the right file for the wrong
 * reason.
 *
 * Fix on failure: `npm run druck:sync`, then commit what it writes.
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
const TARGET = "public/assets/print";

check("die Liste der erzeugten Drucksachen ist nicht leer", () => {
  // Non-vacuity. An empty list would make every assertion below pass without testing
  // anything, and this file's whole job is to not be that kind of check.
  assert.ok(GENERATED.length > 0, "GENERATED is empty — the loop below would prove nothing");
});

for (const src of GENERATED) {
  const dst = join(TARGET, basename(src));

  check(`${basename(src)}: Bau vorhanden`, () => {
    assert.ok(existsSync(join(root, src)), `missing ${src} — run the matching build.mjs --pdf`);
  });

  check(`${basename(src)}: ausgeliefert vorhanden`, () => {
    assert.ok(existsSync(join(root, dst)), `missing ${dst} — run: npm run druck:sync`);
  });

  check(`${basename(src)}: ausgeliefert = gebaut`, () => {
    const a = readFileSync(join(root, src));
    const b = readFileSync(join(root, dst));
    assert.ok(
      a.equals(b),
      `${dst} differs from ${src} — the website is serving a different file than the build produced. Fix: npm run druck:sync`,
    );
  });
}

console.log(`\nprint assets (ausgeliefert = gebaut): ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
