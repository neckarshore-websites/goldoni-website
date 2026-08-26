import assert from "node:assert/strict";
import nextConfig from "../../next.config";
import { ORDER_PATH, ORDER_LANDING, storefrontUrl } from "../../src/lib/site";

/**
 * Proves the site actually serves the path that gets PRINTED on the cards.
 *
 * THE FAILURE THIS GUARDS IS ASYMMETRIC, which is why it earns its own file. Every other
 * broken link on this site is a bad afternoon: notice it, edit it, deploy. A printed QR
 * pointing at a path we do not serve is 500 cards in a drawer and a dead end for every
 * guest who scans one. The website can be fixed; the paper cannot.
 *
 * So this asserts the pair that has to hold together and is otherwise held together only
 * by someone remembering: the address the print assets encode (`ORDER_LANDING`) and the
 * redirect entry that answers it (`ORDER_PATH`). Both derive from the same constant, so
 * the test is not re-typing them — it is checking the derivation reaches the config.
 *
 * WHAT IT DOES NOT PROVE, and the distinction matters enough to state: this reads the
 * build configuration, not production. A green run here means the entry exists in the
 * code. Before any print order, the deployed behaviour is verified separately:
 *
 *   curl -sSI https://ristorante-goldoni.de/bestellen   # expect 307 -> the papier URL
 *
 * That command is the pre-print gate. This file is the thing that keeps the entry from
 * being deleted between now and then.
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

type Rule = {
  source: string;
  destination: string;
  permanent?: boolean;
  has?: unknown;
};

async function main() {
  assert.ok(
    typeof nextConfig.redirects === "function",
    "next.config no longer declares redirects()",
  );
  const rules = (await nextConfig.redirects!()) as Rule[];
  const ordering = rules.filter((r) => r.source === ORDER_PATH);

  check("die gedruckte Adresse hat genau eine Weiterleitung", () => {
    assert.equal(
      ordering.length,
      1,
      `expected exactly one rule for ${ORDER_PATH}, found ${ordering.length}`,
    );
  });

  check("sie zeigt auf den Bestellweg mit Papier-Kennung", () => {
    assert.equal(ordering[0]?.destination, storefrontUrl("papier"));
  });

  check("sie ist NICHT dauerhaft (307, nicht 308)", () => {
    // The one property the whole construction was chosen to buy. A 308 is cached by the
    // browser indefinitely, so every already-scanned card would keep resolving to the old
    // destination no matter what we edit later — repointable paper that cannot be
    // repointed. If this assertion ever fails, read the comment in next.config before
    // "fixing" the test.
    assert.equal(
      ordering[0]?.permanent,
      false,
      "the printed path became a permanent redirect — printed cards can no longer be repointed",
    );
  });

  check("die Schrägstrich-Variante läuft in einem Sprung", () => {
    const withSlash = rules.filter((r) => r.source === `${ORDER_PATH}/`);
    assert.equal(withSlash.length, 1, `expected one rule for ${ORDER_PATH}/`);
    assert.equal(withSlash[0]?.destination, storefrontUrl("papier"));
    assert.equal(withSlash[0]?.permanent, false);
  });

  check("sie steht VOR der allgemeinen Schrägstrich-Regel", () => {
    // src/lib/redirects.ts ends with a catch-all `/:path+/` -> `/:path+` at
    // `permanent: true`. If the ordering rules sat behind it, `/bestellen/` would pick up
    // a PERMANENT cache entry on the way — reintroducing exactly the stickiness the 307
    // above exists to avoid.
    const catchAll = rules.findIndex((r) => r.source === "/:path+/");
    const last = rules.map((r) => r.source).lastIndexOf(`${ORDER_PATH}/`);
    assert.ok(catchAll >= 0, "the general trailing-slash rule disappeared");
    assert.ok(
      last < catchAll,
      "the ordering rules moved behind the general trailing-slash rule",
    );
  });

  check("die gedruckte Adresse und der bediente Pfad passen zusammen", () => {
    // Guards the seam between two files: print assets encode ORDER_LANDING, the config
    // serves ORDER_PATH. Both derive from site.ts today — this fails the day one of them
    // stops deriving and gets typed out by hand.
    assert.ok(
      ORDER_LANDING.endsWith(ORDER_PATH),
      `printed address ${ORDER_LANDING} does not end in the served path ${ORDER_PATH}`,
    );
  });

  console.log(`\norder redirect: ${pass} passed, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

void main();
