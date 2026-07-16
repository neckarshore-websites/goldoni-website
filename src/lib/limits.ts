/**
 * Field length limits — single source of truth for client + server.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * Until 2026-07-16 the limits lived as bare consts inside the Server
 * Action (`MAX_FIELD_LEN = 200`, `MAX_MESSAGE_LEN = 500`) and were
 * enforced by `.slice()` — silent truncation. A guest could write a
 * 900-character allergy note, see "Grazie!", and the owner would
 * receive a message cut off mid-sentence. Nobody noticed. The e2e test
 * even *asserted* the truncation as desired behaviour, and its comment
 * claimed `MAX_MESSAGE_LEN=4000` while the code said 500 — the numbers
 * had drifted apart because they lived in two places.
 *
 * Now: one object, imported by both the form components (live counter)
 * and the action (validation). Client and server can no longer disagree.
 *
 * ENFORCEMENT CONTRACT
 * --------------------
 * These are *validation* limits, never truncation limits. Over-long
 * input produces a field error and the value is echoed back intact —
 * we never silently drop a guest's text. Deliberately NOT rendered as
 * a `maxLength` attribute: a hard cap cannot be "exceeded", so the
 * warning would never fire, and pasting 3000 chars into a
 * `maxLength=2000` textarea makes the browser drop 1000 of them
 * without a word — reintroducing the exact bug this replaces, one
 * layer up.
 */

export const LIMITS = {
  /** Free-text: /kontakt Nachricht + /feiern Anmerkungen. */
  message: 2000,
  /** Generous for real names incl. titles and double-barrelled surnames. */
  name: 100,
  /** RFC 5321 §4.5.3.1.3 — max length of a forward-path. */
  email: 254,
  /** E.164 max is 15 digits; 32 leaves room for "+49 (711) 659 98 89". */
  phone: 32,
  /** Free-text-ish: 'ab 18:00', 'Sonntag mittags nach der Kirche'. */
  preferredTime: 100,
  /** Select value — bounded by OCCASIONS, this is just a sanity cap. */
  occasion: 64,
  /** Digits only; 6 covers any party this kitchen will ever cater. */
  guestCount: 6,
} as const;

export type LimitField = keyof typeof LIMITS;

/** German field labels for length-error messages. */
const FIELD_LABELS: Record<LimitField, string> = {
  message: "Die Nachricht",
  name: "Der Name",
  email: "Die E-Mail-Adresse",
  phone: "Die Telefonnummer",
  preferredTime: "Die Wunschzeit",
  occasion: "Der Anlass",
  guestCount: "Die Gästeanzahl",
};

/** Thousands-separated German number, e.g. 2000 → "2.000". */
export function formatCount(n: number): string {
  return n.toLocaleString("de-DE");
}

/**
 * Returns a German error message if `value` exceeds the limit for
 * `field`, otherwise undefined. Same wording client- and server-side so
 * the guest reads one consistent sentence.
 */
export function lengthError(
  field: LimitField,
  value: string,
): string | undefined {
  const max = LIMITS[field];
  if (value.length <= max) return undefined;
  const over = value.length - max;
  return (
    `${FIELD_LABELS[field]} ist ${formatCount(over)} Zeichen zu lang ` +
    `(${formatCount(value.length)} von maximal ${formatCount(max)}). ` +
    `Bitte kürzen — wir schneiden nichts ab.`
  );
}
