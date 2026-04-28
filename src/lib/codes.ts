/**
 * Goldoni — Allergen / additive code reference.
 *
 * Single source of truth for the legend rendered at the bottom of each menu.
 * The Hauptspeisekarte and Empfehlungskarte JSON files only reference codes
 * by their letter or number; the human-readable name lives here.
 */

export interface Code {
  code: string;
  name: string;
}

/** LMIV — Lebensmittel-Informationsverordnung (DE), 14 mandatory allergens. */
export const LMIV_ALLERGENS: Code[] = [
  { code: "A", name: "Glutenhaltiges Getreide" },
  { code: "B", name: "Krebstiere" },
  { code: "C", name: "Eier" },
  { code: "D", name: "Fische" },
  { code: "E", name: "Erdnuesse" },
  { code: "F", name: "Sojabohnen" },
  { code: "G", name: "Milch (Laktose)" },
  { code: "H", name: "Schalenfruechte (Nuesse)" },
  { code: "L", name: "Sellerie" },
  { code: "M", name: "Senf" },
  { code: "N", name: "Sesam" },
  { code: "O", name: "Schwefeldioxid / Sulfite" },
  { code: "P", name: "Lupinen" },
  { code: "R", name: "Weichtiere" },
];

/** ZZulV — Zusatzstoff-Zulassungsverordnung (DE), kennzeichnungspflichtige Zusatzstoffe. */
export const ZZULV_ADDITIVES: Code[] = [
  { code: "1", name: "Mit Farbstoff" },
  { code: "2", name: "Mit Konservierungsstoff" },
  { code: "3", name: "Mit Antioxidationsmittel" },
  { code: "4", name: "Mit Geschmacksverstaerker" },
  { code: "5", name: "Geschwefelt" },
  { code: "6", name: "Geschwaerzt" },
  { code: "7", name: "Gewachst" },
  { code: "8", name: "Mit Phosphat" },
  { code: "9", name: "Mit Suessungsmittel" },
  { code: "10", name: "Mit Phenylalaninquelle" },
  { code: "11", name: "Mit Suessungsmittel und Zucker" },
  { code: "12", name: "Chininhaltig" },
  { code: "13", name: "Coffeinhaltig" },
];

/** House codes — Restaurant-eigene Kennzeichnungen, Bedeutung pending. */
export const HOUSE_CODES: Code[] = [
  { code: "I", name: "Hauseigener Code (Bedeutung folgt)" },
  { code: "J", name: "Hauseigener Code (Bedeutung folgt)" },
  { code: "S", name: "Hauseigener Code (Bedeutung folgt)" },
];
