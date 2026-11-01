/**
 * Contact-form and captcha settings that are NOT secret, kept in code, not in Vercel.
 *
 * Ticket: neckarshore-ai/neckarshore-planning#2879 (Founder decision 2026-10-02),
 * same pattern as kaze-website#54 and neckarshore-website#286.
 *
 * WHY THEY LIVE HERE: every one of these values sat in Vercel as type "sensitive",
 * which nobody can read back. A value you cannot read, you cannot check: on
 * kaze.neckarshore.ai that lost a contact message on 2026-10-01. Here it is
 * readable, versioned and guarded by tests/delivery/kontakt-config.test.ts.
 *
 * WHAT MUST NEVER LIVE HERE: passwords, secret keys, tokens. Those stay in Vercel
 * and are read where they are used. The test goes red when such a variable or
 * field name appears in this file, which is why this comment spells none of them.
 *
 * NO FALLBACK TO THE OLD VARIABLE NAMES, on purpose: production reads these values
 * only from here, so the old Vercel variables are inert from this deploy on.
 *
 * ENVIRONMENTS: what has an effect only where a secret exists is gated on that
 * secret, not on a second switch. The secrets are set for Production only, so
 * previews and `npm run dev` send no mail and show no captcha widget.
 */

export interface KontaktEinstellungen {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  absender: string;
  empfaenger: string;
  kopieAn: string;
}

/**
 * Sources, measured 2026-10-30 and 2026-11-01:
 * - absender, empfaenger: headers of two delivered Feieranfrage mails (2026-09-03,
 *   2026-10-22): From goldoni@rauhut.com, To info@ristorante-goldoni.de.
 * - kopieAn: those two mails arrived in the Founder's rauhut.com account, and the
 *   action sets no other copy path. Report 2026-05-07-linus-fe-b names the value.
 * - smtpHost, smtpPort, smtpUser, display name: report 2026-05-07-linus-fe-b, the
 *   IONOS mailbox that answered 250 OK. Vercel shows no edit of these variables
 *   since that day (updatedAt), and smtp.ionos.de:587 answers with STARTTLS.
 *
 * The mailbox sits at rauhut.com because the restaurant's Microsoft 365 mailbox has
 * SMTP sign-in disabled; it is not a typo for a goldoni domain.
 */
export const KONTAKT: KontaktEinstellungen = {
  smtpHost: "smtp.ionos.de",
  smtpPort: 587,
  smtpUser: "goldoni@rauhut.com",
  absender: "Goldoni <goldoni@rauhut.com>",
  empfaenger: "info@ristorante-goldoni.de",
  kopieAn: "german@rauhut.com",
};

/**
 * Public Turnstile site key, read from the shipped JS bundle of
 * ristorante-goldoni.de on 2026-11-01. Public by design: every browser receives it.
 */
export const TURNSTILE_SITEKEY = "0x4AAAAAADjhB6LT9WP9rB_w";

/**
 * Captcha on both forms. The widget renders on /kontakt and /feiern in Production
 * (measured 2026-10-04), so the client switch was on. Where it takes effect is
 * gated on the secret, see `captchaSitekey` in src/lib/captcha/verify.ts.
 */
export const CAPTCHA_AKTIV = true;
