/**
 * Ristorante Goldoni — Single source of truth for restaurant facts.
 * Everywhere on the site that references address, hours, contact, etc.
 * imports from here. Update here, propagates everywhere.
 */

export const SITE = {
  name: "Ristorante Goldoni",
  tagline: "Bella Italia in Stuttgart",
  description:
    "Italienisch verliebte Kueche im Stuttgarter Westen. Frische Zutaten, mit Liebe gemacht.",
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

  // Hours
  hours: [
    { days: "Mi - So", time: "18:00 - 23:00" },
    { days: "Mo + Di", time: "geschlossen" },
  ],

  // External links
  social: {
    facebook:
      "https://www.facebook.com/Ristorante-Goldoni-152510754787757/",
    wolt: "https://wolt.com/de/deu/stuttgart/restaurant/goldoni",
  },

  // Delivery partners — used by the homepage delivery banner + footer.
  delivery: [
    {
      name: "Wolt",
      url: "https://wolt.com/de/deu/stuttgart/restaurant/goldoni",
      tagline: "Bestellen auf Wolt",
    },
    {
      // Hash-ID is Uber's permanent restaurant identifier (verified 2026-04-28:
      // path with ID returns 200, path without ID returns 404).
      // Query params like ?diningMode=DELIVERY are UI-state tracking, stripped.
      name: "Uber Eats",
      url: "https://www.ubereats.com/de/store/ristorante-goldoni/b6ZSgAthWcC5UJSAaK97mA",
      tagline: "Bestellen auf Uber Eats",
    },
  ],

  // Founded — TODO: confirm with owner
  founded: 0, // 0 = unknown / not yet confirmed
} as const;

export type SiteConfig = typeof SITE;
