import assert from "node:assert/strict";
import { SITE } from "../../src/lib/site";
import { requireLogo, PARTNER_LOGOS } from "../../src/lib/delivery-logos";

/**
 * Guards the delivery/ordering channel model.
 *
 * The banner used to key its behaviour off partner NAMES and drop anything it
 * did not recognise (`if (!logo) return null`). Hierarchy now lives in
 * `channel` and the logo lookup throws. These checks assert both properties
 * before a build ever runs, so the failure shows up as a named test rather
 * than a stack trace during prerender.
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

// NON-VACUITY FIRST. Every check below loops over SITE.delivery; an empty list
// would make all of them pass while proving nothing. This is the whole point of
// stating it as its own assertion rather than trusting the loops.
check("delivery list is non-empty (guards the loops below)", () => {
  assert.ok(
    SITE.delivery.length > 0,
    "SITE.delivery is empty — every other check in this file would be vacuous",
  );
});

check("every partner declares a known channel", () => {
  for (const p of SITE.delivery) {
    assert.ok(
      p.channel === "own" || p.channel === "marketplace",
      `partner "${p.name}" has channel "${p.channel}"`,
    );
  }
});

check("every partner has a registered brand asset (fail-closed)", () => {
  for (const p of SITE.delivery) {
    assert.doesNotThrow(
      () => requireLogo(p.name),
      `partner "${p.name}" would have been dropped silently by the old lookup`,
    );
  }
});

check("requireLogo throws for an unregistered partner", () => {
  const unknown = "Lieferando";
  assert.ok(
    !(unknown in PARTNER_LOGOS),
    `fixture broken: "${unknown}" is registered, pick another name`,
  );
  assert.throws(() => requireLogo(unknown), /No brand asset registered/);
});

check("every partner has a usable url and tagline", () => {
  for (const p of SITE.delivery) {
    assert.match(p.url, /^https:\/\//, `partner "${p.name}" url is not https`);
    assert.ok(p.tagline.trim().length > 0, `partner "${p.name}" has no tagline`);
  }
});

check("no Wolt MARKETPLACE ordering URL survives in the delivery config", () => {
  // The work order's own Definition of Done phrased this as `grep -rn "wolt.com"
  // src/` returning nothing. That grep stopped discriminating the moment the
  // privacy policy link (explore.wolt.com) landed in /datenschutz, where it
  // belongs. The condition that actually matters is narrower: no ordering URL
  // pointing at the ~30 % marketplace channel.
  for (const p of SITE.delivery) {
    assert.doesNotMatch(
      p.url,
      /wolt\.com\/[a-z]{2}\/[a-z]{3}\/[^/]+\/restaurant\//i,
      `partner "${p.name}" points at the Wolt marketplace, not our own page`,
    );
  }
});

check("the own channel is the Storefront", () => {
  const own = SITE.delivery.filter((p) => p.channel === "own");
  assert.equal(own.length, 1, "expected exactly one own ordering channel");
  assert.match(own[0].url, /^https:\/\/order\.site\//);
  assert.match(own[0].url, /\/de\//, "own channel is not the German locale");
});

check("at most one own channel", () => {
  const own = SITE.delivery.filter((p) => p.channel === "own");
  assert.ok(
    own.length <= 1,
    `${own.length} partners marked "own" — the banner renders a single leading button`,
  );
});

console.log(`\ndelivery channel model: ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
