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
import type { Menu, MenuItem, MenuCategory, DietTag } from "./menu";
import type { Faq } from "@/data/faqs";

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
 *
 * A day-group may carry several windows separated by " & " (e.g. Sunday
 * lunch 11:30–14:30 plus dinner 18:00–22:30). Each window becomes its own
 * OpeningHoursSpecification — schema.org has no multi-interval shorthand,
 * so two specs over the same dayOfWeek is the correct representation.
 */
function buildOpeningHours(): Array<Record<string, unknown>> {
  return SITE.hours
    .filter((h) => !/geschlossen/i.test(h.time))
    .flatMap((h) => {
      const dayOfWeek = expandDays(h.days);
      return h.time.split("&").map((window) => {
        const [opens, closes] = window.split("-").map((s) => s.trim());
        return {
          "@type": "OpeningHoursSpecification",
          dayOfWeek,
          opens,
          closes,
        };
      });
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
      `${SITE.url}/images/hero-menu-dishes.webp`,
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.coordinates.lat,
      longitude: SITE.coordinates.lng,
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
    // sameAs — verified social ownership signals. Filter empty strings so
    // optional profiles (e.g. Instagram before owner-confirmation) do not
    // leak as broken entries into the JSON-LD.
    sameAs: [SITE.social.facebook, SITE.social.instagram].filter(Boolean),
  };
}

/**
 * BreadcrumbList — tells Google the page's place in the site
 * hierarchy. Shows up as the "site > section > page" trail above
 * the title in search results.
 *
 * Pass the trail in left-to-right order; the helper assigns positions.
 * Always start with Home (the helper adds it automatically), so
 * callers only need to pass the leaf page's `{ name, path }`.
 *
 * Path is relative ("/menu"); the helper resolves it against SITE.url.
 */
export function breadcrumbJsonLd(
  trail: { name: string; path: string }[],
): Record<string, unknown> {
  const items = [{ name: "Start", path: "/" }, ...trail];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: entry.name,
      item: `${SITE.url}${entry.path === "/" ? "" : entry.path}`,
    })),
  };
}

/**
 * Maps our internal DietTag to Schema.org's RestrictedDiet enum URLs.
 * Items can carry multiple tags; only mappable ones are emitted, so
 * "spicy" silently drops out (no Schema.org equivalent).
 */
const DIET_MAP: Partial<Record<DietTag, string>> = {
  vegetarian: "https://schema.org/VegetarianDiet",
  vegan: "https://schema.org/VeganDiet",
};

/**
 * Build the Schema.org MenuItem node for a single dish.
 * Volume (e.g. "0,3 l" for drinks) is appended to the description so
 * it appears in rich-results previews; we don't lose data by omitting
 * Schema.org's missing servingSize property.
 */
function menuItemJsonLd(item: MenuItem): Record<string, unknown> {
  const desc = item.volume
    ? [item.description, item.volume].filter(Boolean).join(" · ")
    : item.description;

  const node: Record<string, unknown> = {
    "@type": "MenuItem",
    name: item.name,
    offers: {
      "@type": "Offer",
      price: item.price,
      priceCurrency: "EUR",
    },
  };

  if (desc) node.description = desc;

  const diets = (item.diet ?? [])
    .map((d) => DIET_MAP[d])
    .filter((v): v is string => Boolean(v));
  if (diets.length === 1) {
    node.suitableForDiet = diets[0];
  } else if (diets.length > 1) {
    node.suitableForDiet = diets;
  }

  return node;
}

function menuSectionJsonLd(category: MenuCategory): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@type": "MenuSection",
    name: category.name,
    hasMenuItem: category.items.map(menuItemJsonLd),
  };

  // Subtitle/description provide search-result context — include both
  // when present, joined for a single richer description line.
  const desc = [category.subtitle, category.description]
    .filter(Boolean)
    .join(" — ");
  if (desc) node.description = desc;

  return node;
}

/**
 * Menu — the full Schema.org `Menu` node for the /menu page.
 *
 * `isPartOf` references the Restaurant node by @id (set on the root
 * layout's Restaurant JSON-LD). This lets Google connect the menu to
 * the restaurant entity without duplicating NAP data here.
 *
 * `inLanguage: "de"` is the page language, not the cuisine language —
 * dish names stay Italian inside the items.
 */
export function menuJsonLd(menu: Menu, path: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: menu.title,
    description: menu.intro,
    inLanguage: "de",
    mainEntityOfPage: `${SITE.url}${path}`,
    isPartOf: { "@id": `${SITE.url}/#restaurant` },
    dateModified: menu.updated,
    hasMenuSection: menu.categories.map(menuSectionJsonLd),
  };
}

/**
 * FAQPage — eligible for the FAQ rich result on Google. Helps the
 * site appear for question-shaped queries ("Wann hat Goldoni
 * geöffnet?", "Liefert Goldoni nach Hause?") in both classic SERPs
 * and AI-generated answers (ChatGPT, Perplexity, Gemini).
 *
 * The FAQs themselves live in `src/data/faqs.ts` so non-developers
 * can edit them with a one-file PR.
 */
export function faqJsonLd(faqs: readonly Faq[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
