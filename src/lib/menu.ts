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
 */

export type AllergenCode =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "R";

export type DietTag = "vegetarian" | "vegan" | "spicy";

export interface MenuItem {
  /** Display name in Italian (e.g. "Spaghetti alle Vongole"). */
  name: string;
  /** Optional short German description / ingredients line. */
  description?: string;
  /** Price as decimal-string for stable formatting (e.g. "12.50"). */
  price: string;
  /** LMIV allergen codes. Empty array if none / not yet captured. */
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
