/**
 * Canonical occasion list for /feiern.
 *
 * Single source of truth used by:
 *   - FeiernForm.tsx  (select options)
 *   - inquiry.ts      (label lookup for email subject + body)
 *   - email-html.ts   (display label in mail template)
 */

export interface Occasion {
  value: string;
  label: string;
}

export const OCCASIONS: Occasion[] = [
  { value: "hochzeit", label: "Hochzeit" },
  { value: "geburtstag", label: "Geburtstag" },
  { value: "taufe", label: "Taufe / Kommunion" },
  { value: "firmenfeier", label: "Firmenfeier" },
  { value: "familienfest", label: "Familienfest" },
  { value: "sonstiges", label: "Sonstiges" },
];

/** Returns the display label for a given occasion value, or the value itself as fallback. */
export function occasionLabel(value: string): string {
  return OCCASIONS.find((o) => o.value === value)?.label ?? value;
}
