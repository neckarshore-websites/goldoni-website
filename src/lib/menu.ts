/**
 * Goldoni — Menu types.
 *
 * The Hauptspeisekarte (main menu) lives as JSON in `src/data/speisekarte.json`.
 * It is imported and rendered statically. Updates ship as commits.
 *
 * The Empfehlungskarte (weekly recommendations) is a separate stream that
 * may later be filled by a photo-to-markdown skill — same MenuItem shape.
 *
 * Allergen codes follow German LMIV (Lebensmittel-Informationsverordnung):
 *   A Glutenhaltiges Getreide   B Krebstiere   C Eier   D Fische
 *   E Erdnuesse   F Sojabohnen   G Milch (Laktose)   H Schalenfruechte
 *   L Sellerie   M Senf   N Sesam   O Schwefeldioxid/Sulfite
 *   P Lupinen   R Weichtiere
 *
 * Restaurants sometimes use additional house-codes alongside LMIV
 * (e.g. "I" or "S" — needs clarification per restaurant). We therefore
 * type the allergen field as plain string and document the meaning in
 * the menu's `footnote` field.
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
