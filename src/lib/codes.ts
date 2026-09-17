/**
 * Goldoni — Allergen / additive code reference.
 *
 * Single source of truth for the legend rendered at the bottom of each menu.
 * The Hauptspeisekarte and Empfehlungskarte JSON files only reference codes
 * by their letter or number; the human-readable name lives here.
 *
 * Source: the legend printed on the Goldoni Speisekarte (photo 2026-09-17),
 * confirmed by the Inhaber as the official designations. Order and codes
 * follow the printed card exactly, so a guest who reads a code in the
 * restaurant finds the same meaning online. Obvious typos on the print
 * ("Sellari", "Phosphan", "Milchweiß", "Antioxidant") are corrected here;
 * code and meaning are unchanged.
 *
 * History: until 2026-09-17 this file used a different scheme (N Sesam,
 * P Lupinen, R Weichtiere, additives 7-13 shifted, plus a "house codes"
 * group I/J/S). The codes on the dishes had always followed the printed
 * card, so 21 references resolved to a wrong meaning.
 * `tests/delivery/menu-codes.test.ts` now guards that every code used on a
 * dish resolves here.
 */

export interface Code {
  code: string;
  name: string;
}

/** Allergens, letters as printed on the card (A-N, S). */
export const ALLERGENS: Code[] = [
  { code: "A", name: "Glutenhaltig" },
  { code: "B", name: "Krebstiere" },
  { code: "C", name: "Eier" },
  { code: "D", name: "Fisch" },
  { code: "E", name: "Erdnüsse" },
  { code: "F", name: "Soja" },
  { code: "G", name: "Milch" },
  { code: "H", name: "Schalenfrüchte" },
  { code: "I", name: "Sellerie" },
  { code: "J", name: "Senf" },
  { code: "K", name: "Sesamsamen" },
  { code: "L", name: "Schwefeldioxid" },
  { code: "M", name: "Lupinen" },
  { code: "N", name: "Weichtiere" },
  { code: "S", name: "Sulfite" },
];

/** Additives, numbers as printed on the card (1-15). */
export const ADDITIVES: Code[] = [
  { code: "1", name: "Farbstoff" },
  { code: "2", name: "Konservierungsstoff" },
  { code: "3", name: "Antioxidationsmittel" },
  { code: "4", name: "Geschmacksverstärker" },
  { code: "5", name: "Geschwefelt" },
  { code: "6", name: "Geschwärzt" },
  { code: "7", name: "Phosphat" },
  { code: "8", name: "Milcheiweiß" },
  { code: "9", name: "Koffeinhaltig" },
  { code: "10", name: "Chininhaltig" },
  { code: "11", name: "Süßungsmittel" },
  { code: "12", name: "Phenylalaninquelle" },
  { code: "13", name: "Gewachst" },
  { code: "14", name: "Taurin" },
  { code: "15", name: "Nitritpökelsalz" },
];
