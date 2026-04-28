/**
 * Schema.org structured data (JSON-LD).
 *
 * Single source for the Restaurant schema rendered in the root layout.
 * Restaurant is a subtype of FoodEstablishment, which is a subtype of
 * LocalBusiness, so a single Restaurant node satisfies both
 * "restaurant rich result" and "local business" eligibility on Google.
 *
 * Fields populated from `src/lib/site.ts` so there is exactly one
 * source of truth for NAP (name, address, phone) data. Updating
 * `site.ts` propagates here automatically.
 *
 * Notes on optional fields:
 * - `geo` (lat/lng) intentionally omitted. Google geocodes the
 *   PostalAddress; manually-guessed coordinates are worse than none.
 *   Add real coordinates from the Google Business Profile when known.
 * - `aggregateRating` omitted — never invent ratings; only add when
 *   sourced from a verifiable review system.
 * - `priceRange` is a public-facing signal ($, $$, $$$, $$$$ or a
 *   currency range). "€€" matches the casual fine-dining position.
 */

import { SITE } from "./site";

const DAY_MAP: Record<string, string[]> = {
  Mo: ["Monday"],
  Di: ["Tuesday"],
  Mi: ["Wednesday"],
  Do: ["Thursday"],
  Fr: ["Friday"],
  Sa: ["Saturday"],
  So: ["Sunday"],
};

const DAY_ORDER = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

/**
 * Expand a "Mi - So" day-range string into the full schema.org list.
 * Single days like "Mo + Di" are also supported via the "+" separator.
 */
function expandDays(days: string): string[] {
  if (days.includes("-")) {
    const [start, end] = days.split("-").map((s) => s.trim());
    const startIdx = DAY_ORDER.indexOf(start);
    const endIdx = DAY_ORDER.indexOf(end);
    if (startIdx === -1 || endIdx === -1) return [];
    return DAY_ORDER.slice(startIdx, endIdx + 1).flatMap(
      (d) => DAY_MAP[d] ?? [],
    );
  }
  if (days.includes("+")) {
    return days
      .split("+")
      .map((s) => s.trim())
      .flatMap((d) => DAY_MAP[d] ?? []);
  }
  return DAY_MAP[days.trim()] ?? [];
}

/**
 * Build OpeningHoursSpecification entries from the SITE.hours config.
 * Closed days are skipped — schema.org represents closure by absence.
 */
function buildOpeningHours(): Array<Record<string, unknown>> {
  return SITE.hours
    .filter((h) => !/geschlossen/i.test(h.time))
    .map((h) => {
      const [opens, closes] = h.time.split("-").map((s) => s.trim());
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: expandDays(h.days),
        opens,
        closes,
      };
    });
}

export function restaurantJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE.url}/#restaurant`,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    image: [
      `${SITE.url}/images/hero-goldoni-velvet.webp`,
      `${SITE.url}/images/hero-goldoni-interior.webp`,
      `${SITE.url}/images/hero-menu-dishes.png`,
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressCountry: SITE.address.country,
    },
    areaServed: {
      "@type": "City",
      name: "Stuttgart",
    },
    servesCuisine: ["Italian", "Italienisch"],
    priceRange: "€€",
    currenciesAccepted: "EUR",
    acceptsReservations: "True",
    hasMenu: `${SITE.url}/menu`,
    openingHoursSpecification: buildOpeningHours(),
    sameAs: [SITE.social.facebook],
  };
}
