"use server";

import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { LEGAL } from "@/lib/legal";
import { buildHtmlMail, buildTextMail } from "@/lib/email-html";
import { occasionLabel } from "@/lib/occasions";
import type {
  InquiryFieldValues,
  InquiryState,
  InquiryType,
} from "./inquiry-state";

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
 * Mail transport: SMTP (DomainFactory) via nodemailer.
 *
 * Env vars (all required in production; missing in production → hard error):
 *   SMTP_HOST          — DomainFactory SMTP host, e.g. `sslout.df.eu`
 *   SMTP_PORT          — `465` for SSL/TLS (default), `587` for STARTTLS
 *   SMTP_USER          — full mailbox address, e.g. `kontakt@goldoni-online.de`
 *   SMTP_PASS          — mailbox password
 *   SMTP_FROM          — From-header, e.g. `Goldoni <kontakt@goldoni-online.de>`.
 *                        The user-part MUST be a real account on the
 *                        authenticated mailbox; otherwise DomainFactory
 *                        rejects with `550 sender not allowed`.
 *   INQUIRY_EMAIL_TO   — recipient mailbox (where the owner reads inquiries)
 *
 * In development (`NODE_ENV !== "production"`) the action falls back to a
 * dry-run that logs the would-be mail and returns success — useful for
 * local dev and Vercel previews without a real mailbox. In production a
 * missing config is treated as an outage and the user gets an honest
 * error message asking them to call instead.
 *
 * Why types and INQUIRY_INITIAL_STATE live in `./inquiry-state.ts`
 * rather than here: a "use server" file can only export async
 * functions in Next.js 15+. Exporting a const object alongside the
 * action triggers a runtime "invalid-use-server-value" crash at
 * module evaluation, which manifests as a 404 on form submit (the
 * Server Action endpoint never registers). See PR #32.
 */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_MESSAGE_LEN = 500;
const MAX_FIELD_LEN = 200;

const TRANSPORT_FAILURE_MESSAGE =
  `Wir können Ihre Anfrage gerade nicht digital übermitteln. Bitte rufen Sie uns kurz an: ${LEGAL.contact.phone}.`;

function clean(formData: FormData, key: string, max = MAX_FIELD_LEN): string {
  return String(formData.get(key) ?? "")
    .trim()
    .slice(0, max);
}

/**
 * Sanitize free-text fields against prompt-injection.
 *
 * Risk model: the owner (or a future automation layer) may pipe incoming
 * inquiry mails into an AI assistant. A malicious actor could craft a
 * message designed to hijack that AI ("Ignore previous instructions…").
 *
 * Defence-in-depth (not a silver bullet — real injection hardening lives
 * in the AI consumer, not here):
 *   1. Strip LLM control tokens (Llama/ChatML/Claude/GPT boundary markers).
 *   2. Strip role prefixes at line-start (System:, Assistant:, Human:, AI:).
 *   3. Collapse excessive blank lines (≥3 → 2) — common padding trick.
 *   4. Strip lone lines of only dashes/equals (prompt-separator markers).
 *   5. Strip C0 control characters except \n and \t.
 *
 * The function intentionally does NOT remove angle brackets or curly
 * braces — those appear in legitimate restaurant messages (allergy codes,
 * "< 10 Gäste", template-style wishes). False-positive cost > injection gain.
 */
function sanitizeText(s: string): string {
  return s
    // Normalize line endings
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Strip C0 control chars except \n (0x0A) and \t (0x09)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // LLM boundary / control tokens (all major model families)
    .replace(/\[\/?(INST|SYS)\]/gi, "")
    .replace(/<<\/?SYS>>/gi, "")
    .replace(/<\|(system|user|assistant|im_start|im_end|endoftext)\|>/gi, "")
    // Role prefixes at start of a line (case-insensitive)
    .replace(
      /^(system|assistant|human|ai|gpt|claude|ignore previous instructions?|ignore above|forget (previous|all)|new instructions?)\s*:\s*/gim,
      "",
    )
    // Prompt-separator lines (lone dashes / equals, ≥3 chars)
    .replace(/^[-=]{3,}\s*$/gm, "")
    // Collapse 3+ consecutive blank lines → 2
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
}

/**
 * Read SMTP config from env. Returns null if any required value is
 * missing (caller decides how to handle: dry-run in dev, error in prod).
 */
function readSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;
  const to = process.env.INQUIRY_EMAIL_TO;

  if (!host || !portRaw || !user || !pass || !from || !to) return null;

  const port = Number(portRaw);
  if (!Number.isFinite(port) || port <= 0 || port > 65535) return null;

  return { host, port, user, pass, from, to };
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
  const message = sanitizeText(clean(formData, "message", MAX_MESSAGE_LEN));

  // Echoed back on every error response so the form keeps the user's
  // input. Raw guestCount string (not Number) so "0", "viele", and
  // empty all round-trip exactly.
  const guestCountRaw = clean(formData, "guestCount");
  const occasionRaw = clean(formData, "occasion");
  const dateRaw = clean(formData, "date");
  const preferredTimeRaw = clean(formData, "preferredTime");

  const echoValues: InquiryFieldValues = {
    name,
    email,
    phone,
    message,
    occasion: occasionRaw,
    date: dateRaw,
    guestCount: guestCountRaw,
    preferredTime: preferredTimeRaw,
  };

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Bitte Namen angeben.";
  if (!email) fieldErrors.email = "Bitte E-Mail angeben.";
  else if (!EMAIL_RE.test(email))
    fieldErrors.email = "Bitte gültige E-Mail-Adresse angeben.";

  // ----- Type-specific validation ----------------------------------
  let occasion = "";
  let date = "";
  let guestCount = 0;
  let preferredTime = "";

  if (type === "kontakt") {
    if (!message) fieldErrors.message = "Bitte Nachricht angeben.";
  } else if (type === "feiern") {
    occasion = occasionRaw;
    date = dateRaw;
    guestCount = Number(guestCountRaw || "0");
    preferredTime = preferredTimeRaw;

    if (!phone) fieldErrors.phone = "Bei Feiern bitte Telefonnummer angeben.";
    if (!occasion) fieldErrors.occasion = "Bitte Anlass auswählen.";
    if (!date) fieldErrors.date = "Bitte Wunschdatum angeben.";
    if (!Number.isFinite(guestCount) || guestCount < 1) {
      fieldErrors.guestCount = "Bitte Gästeanzahl (mind. 1) angeben.";
    }
  } else {
    return {
      status: "error",
      message: "Unbekannter Anfragetyp.",
      values: echoValues,
    };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Bitte Eingaben prüfen.",
      fieldErrors,
      values: echoValues,
    };
  }

  // ----- Build email -----------------------------------------------
  const isFeiern = type === "feiern";
  const subject = isFeiern
    ? `Feieranfrage: ${occasionLabel(occasion)} (${name})`
    : `Kontaktanfrage von ${name}`;

  const emailPayload = isFeiern
    ? {
        type: "feiern" as const,
        name,
        email,
        phone,
        message: message || undefined,
        occasion: occasionLabel(occasion),
        date,
        guestCount,
        preferredTime: preferredTime || undefined,
      }
    : {
        type: "kontakt" as const,
        name,
        email,
        phone: phone || undefined,
        message,
      };

  const htmlBody = buildHtmlMail(emailPayload);
  const textBody = buildTextMail(emailPayload);

  // ----- Send -------------------------------------------------------
  const config = readSmtpConfig();
  const isProd = process.env.NODE_ENV === "production";

  if (!config) {
    if (isProd) {
      // In production a missing SMTP config means real customer inquiries
      // would silently disappear — that's worse than a visible outage.
      // Tell the user to call. Owner sees the env-var gap on next deploy
      // log.
      console.error(
        "[Goldoni Inquiry] SMTP not configured in production — " +
          "set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/SMTP_FROM/INQUIRY_EMAIL_TO",
      );
      return {
        status: "error",
        message: TRANSPORT_FAILURE_MESSAGE,
        values: echoValues,
      };
    }
    // Dev / preview without configured SMTP → log and pretend success.
    console.log(
      `[Goldoni Inquiry / dry-run no SMTP config]\n` +
        `From: <not-configured>\nSubject: ${subject}\n\n${textBody}`,
    );
    return { status: "success" };
  }

  // Pin to the SMTPTransport.Options overload of createTransport — the
  // generic last-overload otherwise picks `TransportOptions` which lacks
  // host/port/secure.
  const transportOptions: SMTPTransport.Options = {
    host: config.host,
    port: config.port,
    // Port 465 is implicit-SSL; 587 starts plain and upgrades via STARTTLS.
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
  };
  const transporter = nodemailer.createTransport(transportOptions);

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to: config.to,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    });
    if (info.rejected.length > 0) {
      console.error(
        "[Goldoni Inquiry] SMTP rejected recipient(s)",
        info.rejected,
      );
      return {
        status: "error",
        message: TRANSPORT_FAILURE_MESSAGE,
        values: echoValues,
      };
    }
    return { status: "success" };
  } catch (err) {
    console.error("[Goldoni Inquiry] SMTP send threw", err);
    return {
      status: "error",
      message: TRANSPORT_FAILURE_MESSAGE,
      values: echoValues,
    };
  }
}
