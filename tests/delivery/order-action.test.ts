import assert from "node:assert/strict";
import { STOREFRONT_PARTNER } from "../../src/lib/site";
import { restaurantJsonLd } from "../../src/lib/structured-data";

/**
 * Guards the machine-readable ordering path in the Restaurant JSON-LD.
 *
 * The site has carried a visible order button since 2026-07-26, but the
 * structured data described a restaurant that takes reservations and has a
 * menu — never one that takes orders. `potentialAction: OrderAction` closes
 * that gap for consumers that read the graph rather than the page.
 *
 * WHAT THIS TEST IS ACTUALLY FOR: the ordering URL must never be typed twice.
 * The button, the printed QR code, the e-mail signatures and now the JSON-LD
 * all resolve from `STOREFRONT_PARTNER.url`. A hardcoded copy in the schema
 * would drift silently — nothing renders it, so no human would ever see it go
 * stale. Asserting equality against the constant alone would be a tautology,
 * so the shape of the constant is asserted separately below.
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

// NON-VACUITY FIRST — same reasoning as channel-model.test.ts. Every check
// below reads `potentialAction`; if it were absent, a loop-based assertion
// would pass over an empty list and prove nothing.
const jsonLd = restaurantJsonLd();
const actions = jsonLd.potentialAction as Array<Record<string, unknown>>;

check("Restaurant node carries a non-empty potentialAction list", () => {
  assert.ok(
    Array.isArray(actions) && actions.length > 0,
    "restaurantJsonLd() has no potentialAction — every check below would be vacuous",
  );
});

check("exactly one OrderAction is declared", () => {
  const orderActions = actions.filter((a) => a["@type"] === "OrderAction");
  assert.equal(
    orderActions.length,
    1,
    `expected 1 OrderAction, found ${orderActions.length}`,
  );
});

check("the OrderAction target resolves from STOREFRONT_PARTNER.url", () => {
  const order = actions.find((a) => a["@type"] === "OrderAction")!;
  const target = order.target as Record<string, unknown>;
  assert.equal(target["@type"], "EntryPoint", "target must be an EntryPoint");
  assert.equal(
    target.urlTemplate,
    STOREFRONT_PARTNER.url,
    "urlTemplate must be the single-source ordering URL, not a copy",
  );
});

// The check above is only as strong as the constant it compares against.
// This asserts the two properties that were decided, not derived: the German
// locale (Wolt's own material ships /en/ for a Stuttgart venue — see
// docs/wolt-storefront-durchstich-2026-07-25.md, W4) and the Storefront host
// rather than a marketplace URL.
check("the ordering constant is the /de/ Storefront, not /en/ or a marketplace", () => {
  assert.ok(
    STOREFRONT_PARTNER.url.startsWith("https://order.site/goldoni/de/"),
    `ordering URL is not the German Storefront: ${STOREFRONT_PARTNER.url}`,
  );
});

check("the OrderAction is reachable from mobile and desktop web", () => {
  const order = actions.find((a) => a["@type"] === "OrderAction")!;
  const target = order.target as Record<string, unknown>;
  const platforms = target.actionPlatform as string[];
  assert.ok(
    Array.isArray(platforms) && platforms.length > 0,
    "actionPlatform missing — consumers cannot tell where the action works",
  );
  for (const required of [
    "https://schema.org/DesktopWebPlatform",
    "https://schema.org/MobileWebPlatform",
  ]) {
    assert.ok(
      platforms.includes(required),
      `actionPlatform is missing ${required}`,
    );
  }
});

// Regression guard for the promise in Datenschutzerklaerung section 9: no Wolt
// script, button or embedded content on this site. A JSON-LD node is inert
// text, and it has to stay that way — if a future edit ever pastes Wolt's
// storefront SDK host in here, this fails.
check("no third-party script host leaks into the schema", () => {
  const serialised = JSON.stringify(jsonLd);
  assert.ok(
    !serialised.includes("storefront-web-static-assets"),
    "Wolt SDK host found in JSON-LD — Datenschutz section 9 promises no embedded Wolt content",
  );
});

console.log(`order-action: ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
