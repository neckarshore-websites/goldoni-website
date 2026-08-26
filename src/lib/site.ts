/**
 * Ristorante Goldoni — Single source of truth for restaurant facts.
 * Everywhere on the site that references address, hours, contact, etc.
 * imports from here. Update here, propagates everywhere.
 */

/**
 * How an ordering channel relates to us.
 *
 * - `own`         — our own ordering page (Wolt Storefront). Roughly 3,5 %
 *                   (pickup) to 16 % (Wolt courier) commission.
 * - `marketplace` — a third-party marketplace with its own audience. Roughly
 *                   30 %.
 *
 * The distinction is DATA, deliberately, not a name comparison inside a
 * component. `PARTNER_LOGOS` in DeliveryBanner.tsx already demonstrates what
 * name-keyed behaviour costs: it breaks silently the moment a partner is
 * renamed or added. Hierarchy belongs where the partners are described.
 */
export type DeliveryChannel = "own" | "marketplace";

export type DeliveryPartner = {
  name: string;
  url: string;
  /**
   * Visible call-to-action. Must remain a substring of the link's accessible
   * name — WCAG 2.5.3 Label in Name. See DeliveryBanner.tsx.
   */
  tagline: string;
  channel: DeliveryChannel;
};

/**
 * The Wolt Storefront entry — LIVE since 2026-07-26, first in `DELIVERY`.
 *
 * Our own ordering channel: roughly 3,5 % (pickup) to 16 % (Wolt courier)
 * commission against the ~30 % a marketplace order costs. The lever only works
 * on visitors who are already on ristorante-goldoni.de, which is why it leads
 * the banner rather than sitting beside the marketplaces.
 *
 * `/de/`, NOT `/en/`. Wolt's activation mail, the attached PDF and the
 * print-ready QR code in it all carry the English variant for a venue in
 * Stuttgart. Both locales return 200, neither redirects, and both resolve to
 * the same venue id — verified 2026-07-25 — so the choice is purely which
 * language a German guest lands in. The QR code in public/images is generated
 * from THIS constant and decoded back in CI, so the printed code cannot drift
 * away from the button.
 *
 * Still exported separately although it now lives in DELIVERY: the internal
 * preview route and the e-mail signatures reference it by name.
 *
 * HOURS: Sunday now matches on both sides (12:00–22:30). The remaining gap is
 * Wed–Sat — Storefront 16:30, this site 18:00 — and it is INTENTIONAL, owner
 * decision 2026-07-26: pizza production for delivery starts before the dining
 * room opens, so the delivery window legitimately runs wider. Do NOT "fix" the
 * site's hours to match; they describe the restaurant, not the kitchen.
 */
export const STOREFRONT_PARTNER: DeliveryPartner = {
  name: "Wolt",
  url: "https://order.site/goldoni/de/deu/stuttgart/restaurant/ristorante-goldoni-sf",
  // Doubles as the button's visible headline. Wolt's own best-practice guide
  // asks for exactly this wording ("Jetzt bestellen" / "Hier bestellen") and
  // warns against vague labels like "Menü".
  tagline: "Jetzt bestellen",
  channel: "own",
};

/**
 * Declared with an explicit type instead of riding the `as const` on SITE.
 * Under `as const` each `channel` would narrow to its own string literal, and
 * a consumer filtering for the other value would fail to compile as an
 * impossible comparison. The union has to survive to the call sites.
 */
const DELIVERY: readonly DeliveryPartner[] = [
  // Own ordering page first — the banner renders `own` as the leading button.
  // The Wolt MARKETPLACE entry that used to sit here is gone on purpose
  // (owner decision, work order 2026-07-25 §1): it offered our own visitors
  // nothing the Storefront does not, at roughly ten times the commission.
  // The Wolt listing in the app is untouched; only this website stops
  // pointing at it.
  STOREFRONT_PARTNER,
  {
    // Hash-ID is Uber's permanent restaurant identifier (verified 2026-04-28:
    // path with ID returns 200, path without ID returns 404).
    // Query params like ?diningMode=DELIVERY are UI-state tracking, stripped.
    name: "Uber Eats",
    url: "https://www.ubereats.com/de/store/ristorante-goldoni/b6ZSgAthWcC5UJSAaK97mA",
    tagline: "Bestellen mit Uber Eats",
    channel: "marketplace",
  },
];


export const SITE = {
  name: "Ristorante Goldoni",
  tagline: "Bella Italia in Stuttgart",
  description:
    "Italienisch verliebte Küche im Stuttgarter Westen. Frische Zutaten, mit Liebe gemacht.",
  url: "https://ristorante-goldoni.de",

  // Contact
  address: {
    street: "Reinsburgstrasse 151",
    postalCode: "70197",
    city: "Stuttgart",
    country: "DE",
  },
  phone: "+49 711 6599889",
  phoneDisplay: "+49 (711) 659 98 89",
  email: "info@goldoni-online.de",
  // Pre-encoded mailto with subject prefix — use this everywhere a clickable
  // email link appears so the user always has a recognisable subject line.
  // Trailing "– " gives a natural separator for the actual topic.
  emailMailto:
    "mailto:info@goldoni-online.de?subject=Nachricht%20von%20der%20Goldoni%20Webseite%20%E2%80%93%20",

  /**
   * Geo coordinates — used by the Restaurant JSON-LD `geo` block to
   * help Google place the pin precisely in Local Pack and Maps.
   * Source: OpenStreetMap node 112695827 ("Ristorante Goldoni"),
   * cross-verified against the postal address.
   */
  coordinates: {
    lat: 48.7685766,
    lng: 9.1509705,
  },

  // Hours
  // A day-group's `time` may hold several windows separated by " & "
  // (e.g. Sunday lunch + dinner). Both consumers understand this:
  // Footer renders the windows, structured-data emits one
  // OpeningHoursSpecification per window. Keep times as "HH:MM - HH:MM"
  // (ASCII hyphen) — the schema builder splits on it.
  hours: [
    { days: "Mi - Sa", time: "18:00 - 22:30" },
    { days: "So", time: "12:00 - 22:30" },
    { days: "Mo + Di", time: "geschlossen" },
  ],

  /**
   * Google Maps reviews URL — used by the homepage ReviewsSection cards
   * and the collective "alle Bewertungen ansehen" CTA.
   *
   * This is Goldoni's official "ask for review" short-link from Google
   * Business Profile (g.page/r/.../review). It opens the place card
   * with the 5-star review-write modal pre-opened. Visitors who only
   * want to read can dismiss the modal; visitors who want to leave a
   * review get a one-click path. The conversion benefit is the reason
   * we route both "lesen" and "ansehen" CTAs through this URL.
   */
  googleReviewsUrl: "https://g.page/r/CTTy_KY_CjykEBM/review",

  // External links
  social: {
    facebook:
      "https://www.facebook.com/Ristorante-Goldoni-152510754787757/",
    // Instagram — owner-confirmed handle.
    // Captured 2026-05-10 via dr-sommer Z1 T9 Finding 1.6 user-decision
    // (resolved DPO-drift: Datenschutz §8 already documented Instagram
    // presence + Meta Platforms Ireland processor, but site.ts was empty —
    // page documented something that did not exist in the UI).
    instagram: "https://www.instagram.com/ristorante_goldoni_stuttgart",
    // `wolt` REMOVED 2026-07-26. It held the Wolt MARKETPLACE URL and had zero
    // consumers anywhere in src/ — a dead field pointing at the ~30 % channel.
    // Left in place it is a landmine: the next rebuild wires it up in good
    // faith and the expensive path is back. The ordering link now lives in
    // `delivery` below, where it is typed by `channel` and cannot be confused
    // with a social profile.
    // Goldoni house playlist — tracking params (?si=… &pi=…) stripped
    // so the URL stays canonical and shareable without leaking the
    // session ID of whoever shared it with us.
    spotifyPlaylist:
      "https://open.spotify.com/playlist/56jhiSGUDlLrWuAtra52LS",
  },

  // Delivery partners — used by the homepage delivery banner + footer.
  // Defined as DELIVERY above so `channel` keeps its union type; see the note
  // there for why `as const` would break the downstream branch.
  delivery: DELIVERY,

  // Public transport — Bus 92 stops directly in front of the restaurant.
  transit: {
    type: "Bus",
    line: "92",
    note: "Haltestelle direkt vor der Tür",
  },

  // Founded — TODO: confirm with owner
  founded: 0, // 0 = unknown / not yet confirmed
} as const;

export type SiteConfig = typeof SITE;

/**
 * WHERE AN ORDER CAME FROM — the marker that had to be decided before the print run.
 *
 * Founder decision 2026-08-26 (option 1 of three): the printed codes do NOT encode the
 * Wolt address. They encode a path on our own domain that redirects there. Two properties
 * follow, and only the second is about measurement:
 *
 *   1. REPOINTABLE. Paper cannot be patched. A code encoding `order.site/...` is dead the
 *      day that address changes or the partner does; a code encoding OUR domain is one
 *      redirect edit away from pointing anywhere. This repo already shows that direction
 *      of travel — the marketplace entry was removed over commission (see DELIVERY above).
 *   2. ATTRIBUTED. The redirect appends `utm_source=papier`; the site's own button and the
 *      e-mail signature carry `utm_source=web`.
 *
 * WHY THE WEB SIDE IS MARKED TOO rather than being "the unmarked one": an order with no
 * marker is not a website order. It is a website order OR a Google order OR one placed in
 * the Wolt app OR someone typing the address. Absence identifies nothing, so the coarse
 * split the decision asked for needs both halves named.
 *
 * THE E-MAIL SIGNATURE COUNTS AS WEB, not paper. It is a screen, and `papier` has to stay
 * a clean answer to the one question the print run is meant to settle — does printed
 * matter pull anyone onto our own ordering channel.
 *
 * WHAT STAYS BARE, deliberately: `structured-data.ts`. A utm-tagged `potentialAction`
 * target would relabel search-engine-originated orders as ours.
 *
 * WHETHER WOLT'S MERCHANT PORTAL REPORTS THE MARKER IS UNMEASURED — we cannot see inside
 * that portal, and nothing here should be read as a claim that we can. What IS measured
 * (2026-08-26, curl): the parameter survives the request — HTTP 200, no redirect, zero
 * hops, nothing stripped.
 */
export const ORDER_PATH = "/bestellen";

/**
 * The address that gets PRINTED. Derived from `SITE.url`, never written out a second
 * time: a hand-copied URL is exactly the drift `scripts/generate-storefront-qr.ts` exists
 * to prevent, and here it would be worse than usual, because the copy that is wrong is
 * the one on 500 beermats.
 */
export const ORDER_LANDING = `${SITE.url}${ORDER_PATH}`;

export type OrderChannel = "papier" | "web";

/**
 * The storefront address carrying its channel marker. `STOREFRONT_PARTNER.url` stays the
 * bare canonical form — every marked variant is derived from it here, so the venue path
 * has exactly one source.
 */
export function storefrontUrl(channel: OrderChannel): string {
  return `${STOREFRONT_PARTNER.url}?utm_source=${channel}`;
}
