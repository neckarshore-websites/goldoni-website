"use server";

import { Resend } from "resend";

/**
 * Inquiry Server Action — handles both /kontakt and /feiern submissions.
 *
 * One action, two payload shapes (discriminated by `type`). Validation
 * happens server-side; client-side `required` is only for UX hints.
 *
 * Anti-spam: a hidden `website` honeypot field. Bots fill in everything
 * including hidden inputs; humans don't see it. If filled, we silently
 * return success without sending mail.
 *
 * Env vars (all optional during development):
 *   RESEND_API_KEY    — Resend API key. Without it, the action logs the
 *                       payload and returns success (dry-run mode for
 *                       previews / local dev).
 *   RESEND_FROM       — From-address. Default uses Resend's onboarding
 *                       sandbox; set to a verified domain for prod.
 *   INQUIRY_EMAIL_TO  — Recipient. Default during owner-test phase is
 *                       german@rauhut.com.
 */

export type InquiryType = "kontakt" | "feiern";

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const INQUIRY_INITIAL_STATE: InquiryState = { status: "idle" };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_MESSAGE_LEN = 4000;
const MAX_FIELD_LEN = 200;

function clean(formData: FormData, key: string, max = MAX_FIELD_LEN): string {
  return String(formData.get(key) ?? "")
    .trim()
    .slice(0, max);
}

export async function sendInquiry(
  _prevState: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // ----- Honeypot ---------------------------------------------------
  if (clean(formData, "website")) {
    // Bot detected — pretend success so they don't retry differently.
    return { status: "success" };
  }

  // ----- Common fields ---------------------------------------------
  const type = clean(formData, "type") as InquiryType;
  const name = clean(formData, "name");
  const email = clean(formData, "email");
  const phone = clean(formData, "phone");
  const message = clean(formData, "message", MAX_MESSAGE_LEN);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Bitte Namen angeben.";
  if (!email) fieldErrors.email = "Bitte E-Mail angeben.";
  else if (!EMAIL_RE.test(email))
    fieldErrors.email = "Bitte gueltige E-Mail-Adresse angeben.";

  // ----- Type-specific validation ----------------------------------
  let occasion = "";
  let date = "";
  let guestCount = 0;
  let preferredTime = "";

  if (type === "kontakt") {
    if (!message) fieldErrors.message = "Bitte Nachricht angeben.";
  } else if (type === "feiern") {
    occasion = clean(formData, "occasion");
    date = clean(formData, "date");
    guestCount = Number(clean(formData, "guestCount") || "0");
    preferredTime = clean(formData, "preferredTime");

    if (!phone) fieldErrors.phone = "Bei Feiern bitte Telefonnummer angeben.";
    if (!occasion) fieldErrors.occasion = "Bitte Anlass auswaehlen.";
    if (!date) fieldErrors.date = "Bitte Wunschdatum angeben.";
    if (!Number.isFinite(guestCount) || guestCount < 1) {
      fieldErrors.guestCount = "Bitte Gaesteanzahl (mind. 1) angeben.";
    }
  } else {
    return { status: "error", message: "Unbekannter Anfragetyp." };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Bitte Eingaben pruefen.",
      fieldErrors,
    };
  }

  // ----- Build email -----------------------------------------------
  const isFeiern = type === "feiern";
  const subject = isFeiern
    ? `Feieranfrage: ${occasion} (${name})`
    : `Kontaktanfrage von ${name}`;

  const lines: string[] = [
    `Name: ${name}`,
    `E-Mail: ${email}`,
  ];
  if (phone) lines.push(`Telefon: ${phone}`);
  if (isFeiern) {
    lines.push(`Anlass: ${occasion}`);
    lines.push(`Datum: ${date}`);
    lines.push(`Gaesteanzahl: ${guestCount}`);
    if (preferredTime) lines.push(`Wunschzeit: ${preferredTime}`);
  }
  if (message) {
    lines.push("");
    lines.push("Nachricht:");
    lines.push(message);
  }
  const body = lines.join("\n");

  // ----- Send -------------------------------------------------------
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_EMAIL_TO ?? "german@rauhut.com";
  const from =
    process.env.RESEND_FROM ?? "Goldoni <onboarding@resend.dev>";

  if (!apiKey) {
    // Dev / preview without configured key → log and pretend success.
    console.log(
      `[Goldoni Inquiry / dry-run no RESEND_API_KEY]\n` +
        `To: ${to}\nFrom: ${from}\nSubject: ${subject}\n\n${body}`,
    );
    return { status: "success" };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text: body,
    });
    if (error) {
      console.error("[Goldoni Inquiry] resend returned error", error);
      return {
        status: "error",
        message:
          "Bei der Uebermittlung ist ein Fehler aufgetreten. Bitte rufen Sie uns kurz an.",
      };
    }
    return { status: "success" };
  } catch (err) {
    console.error("[Goldoni Inquiry] send threw", err);
    return {
      status: "error",
      message:
        "Bei der Uebermittlung ist ein Fehler aufgetreten. Bitte rufen Sie uns kurz an.",
    };
  }
}
