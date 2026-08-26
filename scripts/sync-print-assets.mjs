/**
 * Copies the generated print artifacts from their build folders into `public/assets/print`,
 * which is what the /assets pages actually serve.
 *
 *     npm run druck:sync        # kopieren
 *     npm run druck:sync -- --pruefen   # nur melden, nichts schreiben (CI-Modus)
 *
 * WHY THIS SCRIPT EXISTS. There was no copy step. `docs/postkarte/build.mjs` wrote its PDF
 * next to itself and a human carried it across, which held right up until it didn't: on
 * 2026-08-26 the served postcard and beermat PDFs were 12 hours behind the built ones, and
 * the stale pair still carried a QR code that no phone could read. It cost most of an hour
 * to find, because every check pointed at the freshly built file while the website served
 * the other one.
 *
 * The lesson is the same one this repo learned twice already that day: a check is only a
 * check if it looks at the artifact that actually ships. Here that means the served copy,
 * not the build output — and `tests/delivery/print-assets.test.ts` compares them byte for
 * byte so a forgotten sync fails CI instead of reaching a printer.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { basename, join } from "node:path";
import { pathToFileURL } from "node:url";

const TARGET = "public/assets/print";

/** Everything a build script generates. `wmd-*` files are supplier templates — they are
 *  downloads, have no source here, and are deliberately not listed. */
export const GENERATED = [
  "docs/postkarte/goldoni-postkarte-a6-druckdaten.pdf",
  "docs/postkarte/goldoni-postkarte-a6.pdf",
  "docs/postkarte/goldoni-postkarte-entwuerfe.pdf",
  "docs/bierdeckel/goldoni-bierdeckel-druckdaten.pdf",
  "docs/bierdeckel/goldoni-bierdeckel-entwurf.pdf",
  "docs/briefumschlag/goldoni-briefumschlag-druckdaten.pdf",
  "docs/briefumschlag/goldoni-briefumschlag-entwurf.pdf",
];

/**
 * GUARDED, and the guard is load-bearing. `tests/delivery/print-assets.test.ts` imports
 * GENERATED from this file. Without this check the copy loop ran on import — so the test
 * SILENTLY REPAIRED the drift it exists to detect and then reported 22 green. Caught by
 * deliberately corrupting a served file and watching the test pass anyway; a check nobody
 * tries to break is a check nobody has tested.
 */
function main() {
  const pruefen = process.argv.includes("--pruefen");
  let abweichungen = 0;

  for (const src of GENERATED) {
    const dst = join(TARGET, basename(src));
    if (!existsSync(src)) {
      console.error(`  ! ${src} fehlt — zuerst den zugehoerigen build.mjs --pdf laufen lassen`);
      abweichungen++;
      continue;
    }
    const a = readFileSync(src);
    const b = existsSync(dst) ? readFileSync(dst) : null;
    if (b && a.equals(b)) continue;

    abweichungen++;
    if (pruefen) {
      console.error(`  ✗ ${basename(src)}: ausgeliefert weicht vom Bau ab`);
    } else {
      writeFileSync(dst, a);
      console.log(`  -> ${basename(src)}`);
    }
  }

  if (abweichungen === 0) console.log("Drucksachen: ausgeliefert = gebaut");
  if (pruefen && abweichungen > 0) {
    console.error("\nnpm run druck:sync ausfuehren und die Aenderung mitcommitten.");
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
