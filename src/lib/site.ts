/**
 * Ristorante Goldoni — Single source of truth for restaurant facts.
 * Everywhere on the site that references address, hours, contact, etc.
 * imports from here. Update here, propagates everywhere.
 */

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
  hours: [
    { days: "Mi - So", time: "18:00 - 22:30" },
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
    wolt: "https://wolt.com/de/deu/stuttgart/restaurant/goldoni",
    // Goldoni house playlist — tracking params (?si=… &pi=…) stripped
    // so the URL stays canonical and shareable without leaking the
    // session ID of whoever shared it with us.
    spotifyPlaylist:
      "https://open.spotify.com/playlist/56jhiSGUDlLrWuAtra52LS",
  },

  // Delivery partners — used by the homepage delivery banner + footer.
  delivery: [
    {
      // Tagline matches the visible "Bestellen mit" composite text on the
      // Wolt tile + the Uber Eats brand-portal asset, ensuring the link's
      // accessible name (aria-label) matches its visible text content
      // (WCAG 2.5.3 Label in Name).
      name: "Wolt",
      url: "https://wolt.com/de/deu/stuttgart/restaurant/goldoni",
      tagline: "Bestellen mit Wolt",
    },
    {
      // Hash-ID is Uber's permanent restaurant identifier (verified 2026-04-28:
      // path with ID returns 200, path without ID returns 404).
      // Query params like ?diningMode=DELIVERY are UI-state tracking, stripped.
      name: "Uber Eats",
      url: "https://www.ubereats.com/de/store/ristorante-goldoni/b6ZSgAthWcC5UJSAaK97mA",
      tagline: "Bestellen mit Uber Eats",
    },
  ],

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
