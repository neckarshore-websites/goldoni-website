/**
 * The hidden trap field of the contact and party forms.
 *
 * The old name `website` invites a browser or password manager to fill it, and a
 * filled trap ends in thanks without a mail: a real guest would lose the inquiry and
 * nobody would know (planning L-1102-HONEYPOT-PRUEFEN). So the name carries no word
 * autofill looks for, and every drop is logged, without any content of the form, so
 * that lost inquiries can be counted in the Vercel logs.
 */
export const HONEYPOT_FELD = "nicht_ausfuellen";

/** True when the trap is filled. Logs the form type only, nothing a guest typed. */
export function honeypotAusgeloest(formData: FormData, formular: string): boolean {
  const wert = formData.get(HONEYPOT_FELD);
  if (typeof wert !== "string" || wert.trim() === "") return false;
  console.warn(`[inquiry] honeypot drop form=${formular.replace(/[^a-z]/gi, "").slice(0, 20)}`);
  return true;
}
