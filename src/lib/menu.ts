/**
 * Goldoni — Menu types.
 *
 * The Hauptspeisekarte (main menu) lives as JSON in `src/data/speisekarte.json`.
 * It is imported and rendered statically. Updates ship as commits.
 *
 * The Empfehlungskarte (weekly recommendations) is a separate stream that
 * may later be filled by a photo-to-markdown skill — same MenuItem shape.
 *
 * Allergen codes follow German LMIV (Lebensmittel-Informationsverordnung).
 * Goldoni uses three Goldoni-house letters (I/J/S) instead of the
 * branchen-typical L/M/O for Sellerie/Senf/Sulfite — the codes the
 * Inhaber actually prints on the Karte. The full mapping lives in
 * `src/lib/codes.ts` (LMIV_ALLERGENS + HOUSE_CODES + ZZULV_ADDITIVES);
 * `MenuLegend` in `src/components/MenuSection.tsx` renders them grouped.
 *
 *   LMIV (Goldoni-used):  A Glutenhaltiges Getreide   B Krebstiere
 *                         C Eier   D Fische   E Erdnüsse   F Sojabohnen
 *                         G Milch (Laktose)   H Schalenfrüchte
 *                         N Sesam   P Lupinen   R Weichtiere
 *   Goldoni-house:        I Sellerie   J Senf   S Sulfite
 *   ZZulV (additives):    1-13 (Farbstoff, Konservierung, … see codes.ts)
 *
 * The allergen field is typed as plain string so future codes (or
 * restaurant-specific overrides) can be added in `codes.ts` without
 * a type change here.
 */

export type AllergenCode = string;

export type DietTag = "vegetarian" | "vegan" | "spicy";

export interface MenuItem {
  /** Display name in Italian (e.g. "Spaghetti alle Vongole"). */
  name: string;
  /** Optional short German description / ingredients line. */
  description?: string;
  /** Optional serving volume / size — e.g. "0,3 l", "4 cl". Rendered next to name. */
  volume?: string;
  /** Price as decimal-string for stable formatting (e.g. "12.50"). */
  price: string;
  /** Allergen / additive codes. Empty array if none / not yet captured. */
  allergens?: AllergenCode[];
  /** Diet markers — additive, an item can be both vegetarian and spicy. */
  diet?: DietTag[];
}

export interface MenuCategory {
  /** Stable id used for URL anchors (e.g. "antipasti"). */
  id: string;
  /** Italian heading displayed prominently. */
  name: string;
  /** Optional German subtitle (e.g. "Vorspeisen"). */
  subtitle?: string;
  /** Optional intro line for the category. */
  description?: string;
  items: MenuItem[];
}

export interface Menu {
  /** Display title — usually "Speisekarte". */
  title: string;
  /** Optional intro paragraph above the categories. */
  intro?: string;
  /** ISO date the menu was last updated (YYYY-MM-DD). */
  updated: string;
  categories: MenuCategory[];
  /** Footnote rendered after all categories (allergen legend, disclaimers). */
  footnote?: string;
}

const MENU_MONTHS_DE = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
] as const;

/**
 * Format an ISO date (`YYYY-MM-DD`) as a German long date, e.g.
 * `"2026-07-01"` → `"1. Juli 2026"`.
 *
 * Parsed component-wise on purpose: `new Date("YYYY-MM-DD")` is parsed as
 * UTC midnight, so `Intl`/`toLocaleDateString` in a negative-offset build
 * environment could render the previous day. Splitting the string avoids
 * that drift entirely. Falls back to the raw input if it is not a
 * well-formed ISO date.
 */
export function formatMenuDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day || month < 1 || month > 12) return iso;
  return `${day}. ${MENU_MONTHS_DE[month - 1]} ${year}`;
}
