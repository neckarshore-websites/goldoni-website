/**
 * Brand assets for the delivery/ordering partners, keyed by partner name.
 *
 * Lives here rather than inside DeliveryBanner.tsx so the fail-closed
 * invariant — "every partner in SITE.delivery has a registered asset" — can be
 * asserted by a unit test without rendering React or resolving `next/image`.
 * A guard that cannot be tested is a guard nobody trusts.
 *
 * Assets are brand-portal licensed:
 * - Wolt: cyan circle mark, no call-to-action baked in — we add the label.
 * - Uber Eats: official German co-marketing composite that already reads
 *   "Bestellen mit Uber Eats", so it is rendered self-labeled.
 */
export type PartnerLogo = {
  src: string;
  /**
   * Empty on purpose where the surrounding link supplies the accessible name.
   * A non-empty alt injects the brand name into the link's visible text
   * content and breaks WCAG 2.5.3 Label in Name. See DeliveryBanner.tsx.
   */
  alt: string;
  /** True when the asset already carries its own call-to-action text. */
  selfLabeled: boolean;
};

export const PARTNER_LOGOS: Record<string, PartnerLogo | undefined> = {
  Wolt: {
    src: "/images/wolt-logo.png",
    alt: "",
    selfLabeled: false,
  },
  "Uber Eats": {
    src: "/images/uber-eats-logo.png",
    alt: "Bestellen mit Uber Eats",
    selfLabeled: true,
  },
};

/**
 * FAIL-CLOSED lookup — this replaces an `if (!logo) return null`.
 *
 * The old form silently dropped any partner whose name did not match a key. A
 * rename in site.ts, a new partner, a stray space: the tile simply stopped
 * existing and nothing said so. On a banner whose only job is routing guests
 * to an ordering channel, a link that quietly disappears is the worst failure
 * mode available, because it looks fine.
 *
 * Every page rendering the banner is statically prerendered, so throwing here
 * fails the BUILD. The mistake surfaces in CI, never in production.
 */
export function requireLogo(name: string): PartnerLogo {
  const logo = PARTNER_LOGOS[name];
  if (!logo) {
    throw new Error(
      `No brand asset registered for delivery partner "${name}". ` +
        `Add an entry to PARTNER_LOGOS (src/lib/delivery-logos.ts) or remove ` +
        `the partner from SITE.delivery. ` +
        `(This used to fail silently by omitting the partner.)`,
    );
  }
  return logo;
}
