import Image from "next/image";
import { SITE } from "@/lib/site";
import type { DeliveryPartner } from "@/lib/site";
import { requireLogo } from "@/lib/delivery-logos";

/**
 * Relative weight of our own ordering channel against the marketplaces.
 *
 * - `lead`  — own channel as a large leading button, marketplaces beside it.
 * - `equal` — own channel and marketplaces at the same size.
 *
 * One layout branch over one data model, not two implementations. Which one
 * ships is the venue owner's call; both are rendered side by side on /sandbox
 * so the choice is made by looking rather than imagining.
 */
export type DeliveryLayout = "lead" | "equal";

/**
 * Tile size per layout. THIS is what distinguishes the two variants — not the
 * order button, which stays prominent either way.
 *
 * - `equal` — the historical 96/112 px square. Marketplace and own channel read
 *   as peers.
 * - `lead`  — a deliberately smaller 64/80 px square, so the own channel leads
 *   and the marketplace is present without competing.
 *
 * The work order phrases the choice as "order button large, Uber Eats small
 * beside it" versus "both the same size". If both layouts rendered the same
 * tile there would be nothing to choose between.
 */
const TILE_SIZE: Record<DeliveryLayout, string> = {
  lead: "h-16 w-16 sm:h-20 sm:w-20",
  equal: "h-24 w-24 sm:h-28 sm:w-28",
};
/** Inner logo size, scaled with the tile so the cyan field keeps its padding. */
const TILE_LOGO: Record<DeliveryLayout, string> = {
  lead: "h-9 w-9 sm:h-11 sm:w-11",
  equal: "h-14 w-14 sm:h-16 sm:w-16",
};
/** Height a tile occupies — used to match the button in layout `equal`. */
const TILE_HEIGHT = "h-24 sm:h-28";

/** Marketplace partner — square brand tile, sized by layout. */
function MarketplaceTile({
  partner,
  layout,
}: {
  partner: DeliveryPartner;
  layout: DeliveryLayout;
}) {
  const logo = requireLogo(partner.name);
  const tile = TILE_SIZE[layout];

  return (
    <a
      href={partner.url}
      target="_blank"
      // `noopener` only — see the note on OwnChannelButton for why `noreferrer`
      // is deliberately absent on ordering links.
      rel="noopener"
      aria-label={partner.tagline}
      className="block overflow-hidden rounded-lg shadow-sm transition-transform hover:scale-[1.02] focus-visible:scale-[1.02]"
    >
      {logo.selfLabeled ? (
        // Uber Eats — composite already says "Bestellen mit Uber Eats"
        <Image
          src={logo.src}
          alt={logo.alt}
          width={112}
          height={112}
          className={`block ${tile}`}
        />
      ) : (
        // Wolt — bare logo on cyan field, "Bestellen mit Wolt" label below
        <div
          className={`flex flex-col items-center justify-center ${tile}`}
          style={{ backgroundColor: "#00C2E8" }}
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={96}
            height={96}
            className={`block ${TILE_LOGO[layout]}`}
          />
          {/* Dark-on-cyan label — Wolt's brand portal allows
              both white and dark variants; dark passes WCAG
              contrast (7.94:1 vs. 2.13:1 for white-on-cyan). */}
          <span
            className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide sm:text-[10px]"
            style={{ color: "var(--color-text)" }}
          >
            Bestellen mit
          </span>
        </div>
      )}
    </a>
  );
}

/**
 * Our own ordering channel — Goldoni frame carrying the partner's brand mark.
 *
 * The mark keeps its own brand-portal disc, so it never sits directly on
 * Goldoni salmon. That sidesteps the open brand-portal question rather than
 * pre-empting it.
 */
function OwnChannelButton({
  partner,
  layout,
}: {
  partner: DeliveryPartner;
  layout: DeliveryLayout;
}) {
  const logo = requireLogo(partner.name);

  return (
    <a
      href={partner.url}
      target="_blank"
      // `noopener` WITHOUT `noreferrer`. The pair is a copy-paste habit but does
      // two different jobs: `noopener` severs `window.opener` (the security
      // win, non-negotiable), `noreferrer` additionally strips the Referer.
      //
      // Stripping it on an ORDERING link would be self-harm: the entire case
      // for our own channel is "these are OUR visitors, so ~3,5 % instead of
      // ~30 %". Without a referrer the order arrives as direct traffic and the
      // website is never credited — a number that cannot be reconstructed
      // afterwards. Privacy stays covered by the site-wide
      // `Referrer-Policy: strict-origin-when-cross-origin` (origin only, never
      // the path).
      rel="noopener"
      // No `aria-label` — unlike the marketplace tiles, whose visible text is
      // only the fragment "Bestellen mit". Here the visible text is complete,
      // so the accessible name derives from it and WCAG 2.5.3 Label-in-Name
      // holds without help. Adding an aria-label later would break it.
      className={`inline-flex items-center gap-4 rounded-xl px-7 shadow-sm transition-transform hover:scale-[1.02] focus-visible:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 ${
        layout === "lead" ? "py-4" : TILE_HEIGHT
      }`}
      style={{
        backgroundColor: "var(--color-accent)",
        outlineColor: "var(--color-accent)",
      }}
    >
      <Image
        src={logo.src}
        alt=""
        width={96}
        height={96}
        className="block h-11 w-11 flex-shrink-0 rounded-full sm:h-12 sm:w-12"
      />
      <span className="flex flex-col text-left">
        <span
          className="text-lg font-semibold leading-tight sm:text-xl"
          style={{ color: "var(--color-on-marinara)" }}
        >
          {partner.tagline}
        </span>
        {/* Mozzarella on salmon = 5,1:1, parmigiano on salmon = 4,6:1 —
            both above the 4,5:1 AA threshold for body text. */}
        <span
          className="mt-0.5 text-xs font-medium uppercase tracking-wide sm:text-sm"
          style={{ color: "var(--color-on-marinara-muted)" }}
        >
          bestellt über {partner.name}
        </span>
      </span>
    </a>
  );
}

/**
 * Top-of-homepage banner that points to the ordering channels.
 *
 * Hierarchy comes from `partner.channel` in site.ts, not from a name check
 * here: `own` renders as the leading order button, `marketplace` as a
 * secondary brand tile.
 *
 * Mobile (75% of Goldoni traffic): stacks in a row — touch-friendly.
 * Desktop: sits beside the headline.
 */
export function DeliveryBanner({
  layout = "lead",
  partners = SITE.delivery,
}: {
  layout?: DeliveryLayout;
  /**
   * Overridable ONLY so the noindex preview route can render a prospective
   * partner set — the Storefront entry that is staged in site.ts but not yet
   * live. The production call sites pass nothing and get SITE.delivery.
   *
   * The preview deliberately drives THIS component rather than a copy, so what
   * the owner approves is what ships.
   */
  partners?: readonly DeliveryPartner[];
} = {}) {
  const own = partners.filter((p) => p.channel === "own");
  const marketplaces = partners.filter((p) => p.channel === "marketplace");

  // A `lead` layout with nothing to lead is a contradiction: without an own
  // channel there is no hierarchy to express, so shrinking the marketplace
  // tiles would demote them in favour of nobody. Fall back to `equal`.
  //
  // This is also what keeps the live homepage byte-identical while the
  // Storefront entry is still staged — production renders the default `lead`,
  // has no own partner, and therefore keeps the historical 96/112 px tiles.
  const effectiveLayout: DeliveryLayout = own.length > 0 ? layout : "equal";

  return (
    <section
      className="border-b"
      style={{
        backgroundColor: "var(--color-brand-cream)",
        borderColor: "var(--color-border)",
      }}
      aria-label="Lieferservice"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-4 sm:flex-row sm:gap-8 sm:px-12">
        <p
          className="flex-1 text-center text-sm sm:text-left sm:text-base"
          style={{ color: "var(--color-text)" }}
        >
          <span
            className="mr-2"
            aria-hidden
            style={{ color: "var(--color-accent)" }}
          >
            &#9679;
          </span>
          <strong className="font-medium">Auch nach Hause:</strong>{" "}
          Bestellen Sie unsere Karte direkt aus der Küche &mdash; geliefert
          von unseren Partnern.
        </p>

        <div className="flex flex-shrink-0 items-center gap-3">
          {own.map((partner) => (
            <OwnChannelButton
              key={partner.name}
              partner={partner}
              layout={effectiveLayout}
            />
          ))}
          {marketplaces.map((partner) => (
            <MarketplaceTile
              key={partner.name}
              partner={partner}
              layout={effectiveLayout}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
