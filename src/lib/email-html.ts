/**
 * Email template builder — HTML + plaintext for inquiry mails.
 *
 * Pure functions: no side-effects, no imports from Next.js or server-only
 * modules. Usable in action layer and (if ever added) unit tests.
 *
 * Design: Goldoni brand (Tavola palette), inline CSS only — no external
 * stylesheets, no web fonts (email client fallbacks). Light mode because
 * dark backgrounds have inconsistent support across clients.
 *
 * HTML-escaping: every user-controlled field passes through `escHtml()`
 * before being embedded in HTML. JSON.stringify handles JSON-string escaping;
 * the outer <pre> content still needs HTML-escaping.
 */

import { LEGAL } from "@/lib/legal";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContactPayload {
  type: "kontakt";
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface FeiernPayload {
  type: "feiern";
  name: string;
  email: string;
  phone: string;
  message?: string;
  occasion: string;
  date: string;
  guestCount: number;
  preferredTime?: string;
}

export type InquiryPayload = ContactPayload | FeiernPayload;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Escape HTML special chars so user input renders safely in email. */
function escHtml(s: string | number | undefined): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** ISO-8601 UTC timestamp, e.g. "2026-04-30T18:39:41Z" */
function nowIso(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

/** Human-readable German local time, e.g. "30.04.2026, 20:39 Uhr" */
function nowLocal(): string {
  return new Date().toLocaleString("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) + " Uhr";
}

// ---------------------------------------------------------------------------
// Brand tokens (inline — no import from globals.css possible in non-RSC)
// ---------------------------------------------------------------------------
const C = {
  espresso: "#1A1612",
  mozzarella: "#FAFAFA",
  salmon: "#B64926",
  parmigiano: "#FEF1A5",
  bgMuted: "#F5EDD8",
  border: "#EAE0C5",
  textMuted: "#5C5240",
  borderStrong: "#D4C7A5",
  codeBlock: "#F0E8D0",
};

// ---------------------------------------------------------------------------
// Row builder helpers
// ---------------------------------------------------------------------------

function row(label: string, value: string | number): string {
  if (!value && value !== 0) return "";
  return `
    <tr>
      <td style="padding:6px 12px 6px 0;white-space:nowrap;vertical-align:top;
                 font-size:13px;color:${C.textMuted};font-family:Arial,Helvetica,sans-serif;
                 width:120px;">
        ${escHtml(label)}
      </td>
      <td style="padding:6px 0;vertical-align:top;
                 font-size:14px;color:${C.espresso};font-family:Arial,Helvetica,sans-serif;">
        ${escHtml(value)}
      </td>
    </tr>`;
}

// ---------------------------------------------------------------------------
// HTML template
// ---------------------------------------------------------------------------

export function buildHtmlMail(payload: InquiryPayload): string {
  const isFeiern = payload.type === "feiern";
  const submittedAt = nowIso();
  const submittedAtLocal = nowLocal();

  const title = isFeiern ? "Feieranfrage" : "Kontaktanfrage";

  // ----- Data rows -----
  const metaRows = [
    row("Name", payload.name),
    row("E-Mail", payload.email),
    row("Telefon", payload.phone ?? ""),
    ...(isFeiern
      ? [
          row("Anlass", (payload as FeiernPayload).occasion),
          row("Datum", (payload as FeiernPayload).date),
          row("Gästeanzahl", (payload as FeiernPayload).guestCount),
          row("Wunschzeit", (payload as FeiernPayload).preferredTime ?? ""),
        ]
      : []),
    row("Eingegangen", submittedAtLocal),
  ].join("");

  // ----- Message block -----
  const messageBlock = payload.message
    ? `
    <div style="margin-top:20px;padding:14px 16px;background:${C.bgMuted};
                border-left:3px solid ${C.salmon};border-radius:4px;">
      <p style="margin:0 0 6px;font-size:12px;color:${C.textMuted};
                font-family:Arial,Helvetica,sans-serif;text-transform:uppercase;
                letter-spacing:.06em;">Nachricht</p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:${C.espresso};
                font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;">${escHtml(payload.message)}</p>
    </div>`
    : "";

  // ----- JSON payload -----
  const jsonData: Record<string, unknown> = {
    type: payload.type,
    name: payload.name,
    email: payload.email,
    phone: payload.phone ?? null,
    message: payload.message ?? null,
    ...(isFeiern && {
      occasion: (payload as FeiernPayload).occasion,
      date: (payload as FeiernPayload).date,
      guestCount: (payload as FeiernPayload).guestCount,
      preferredTime: (payload as FeiernPayload).preferredTime ?? null,
    }),
    submittedAt,
    submittedAtLocal,
    source: "ristorante-goldoni.de",
  };

  const jsonString = JSON.stringify(jsonData, null, 2);

  // JSON goes into <pre> — the string content still needs HTML-escaping
  // because angle brackets in user values would break the <pre> block.
  const jsonBlock = `
    <div style="margin-top:28px;border-top:1px solid ${C.border};padding-top:20px;">
      <p style="margin:0 0 8px;font-size:11px;color:${C.textMuted};
                font-family:Arial,Helvetica,sans-serif;text-transform:uppercase;
                letter-spacing:.08em;">Maschinell verarbeitbar · JSON</p>
      <pre style="margin:0;padding:12px 14px;background:${C.codeBlock};
                  border:1px solid ${C.borderStrong};border-radius:4px;
                  font-size:11px;line-height:1.5;color:${C.espresso};
                  font-family:'Courier New',Courier,monospace;overflow-x:auto;
                  white-space:pre;">${escHtml(jsonString)}</pre>
    </div>`;

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#E8E0D0;">

  <!-- Wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0"
         style="width:100%;background:#E8E0D0;">
    <tr><td style="padding:32px 16px;">

      <!-- Card -->
      <div style="max-width:600px;margin:0 auto;background:${C.mozzarella};
                  border-radius:6px;overflow:hidden;
                  box-shadow:0 2px 8px rgba(26,22,18,.12);">

        <!-- Header -->
        <div style="background:${C.espresso};padding:24px 28px;">
          <h1 style="margin:0;font-size:24px;font-weight:700;color:${C.mozzarella};
                     font-family:Georgia,'Times New Roman',serif;line-height:1.2;
                     letter-spacing:.01em;">
            ${isFeiern ? "Feieranfrage" : "Kontaktanfrage"}
          </h1>
          <div style="margin-top:12px;height:2px;width:40px;background:${C.salmon};
                      border-radius:1px;"></div>
        </div>

        <!-- Body -->
        <div style="padding:24px 28px 28px;">

          <!-- Meta rows -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                 style="width:100%;border-collapse:collapse;">
            ${metaRows}
          </table>

          ${messageBlock}
          ${jsonBlock}

        </div>

        <!-- Footer -->
        <div style="padding:14px 28px;background:${C.bgMuted};
                    border-top:1px solid ${C.border};">
          <p style="margin:0;font-size:11px;color:${C.textMuted};
                    font-family:Arial,Helvetica,sans-serif;">
            Ristorante Goldoni · Stuttgart-West ·
            <a href="https://ristorante-goldoni.de"
               style="color:${C.salmon};text-decoration:none;">ristorante-goldoni.de</a>
          </p>
        </div>

      </div>
    </td></tr>
  </table>

</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Customer confirmation mail
// ---------------------------------------------------------------------------

/**
 * Confirmation mail sent to the GUEST (not the owner).
 *
 * Purpose: a receipt. The guest gets back, verbatim, every value they
 * submitted — so if an allergy note or a guest count later goes missing
 * in the restaurant, they hold the proof of what they actually sent.
 *
 * Note this is NOT a truncation detector: since the Server Action now
 * rejects over-long input instead of cutting it, there is nothing left
 * to truncate. The value here is evidence, not error-detection.
 *
 * Deliberately carries no JSON block (that is owner-facing plumbing)
 * and no marketing — it is a confirmation, not a newsletter.
 */
export function buildCustomerHtmlMail(payload: InquiryPayload): string {
  const isFeiern = payload.type === "feiern";
  const submittedAtLocal = nowLocal();

  const metaRows = [
    row("Name", payload.name),
    row("E-Mail", payload.email),
    row("Telefon", payload.phone ?? ""),
    ...(isFeiern
      ? [
          row("Anlass", (payload as FeiernPayload).occasion),
          row("Datum", (payload as FeiernPayload).date),
          row("Gästeanzahl", (payload as FeiernPayload).guestCount),
          row("Wunschzeit", (payload as FeiernPayload).preferredTime ?? ""),
        ]
      : []),
    row("Gesendet am", submittedAtLocal),
  ].join("");

  const messageBlock = payload.message
    ? `
    <div style="margin-top:20px;padding:14px 16px;background:${C.bgMuted};
                border-left:3px solid ${C.salmon};border-radius:4px;">
      <p style="margin:0 0 6px;font-size:12px;color:${C.textMuted};
                font-family:Arial,Helvetica,sans-serif;text-transform:uppercase;
                letter-spacing:.06em;">Ihre Nachricht</p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:${C.espresso};
                font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;">${escHtml(payload.message)}</p>
    </div>`
    : "";

  const intro = isFeiern
    ? "wir haben Ihre Feieranfrage erhalten und melden uns telefonisch, um die Details zu besprechen."
    : "wir haben Ihre Nachricht erhalten und melden uns zeitnah bei Ihnen.";

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Ihre Anfrage bei Ristorante Goldoni</title>
</head>
<body style="margin:0;padding:0;background:#E8E0D0;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0"
         style="width:100%;background:#E8E0D0;">
    <tr><td style="padding:32px 16px;">
      <div style="max-width:600px;margin:0 auto;background:${C.mozzarella};
                  border-radius:6px;overflow:hidden;
                  box-shadow:0 2px 8px rgba(26,22,18,.12);">

        <div style="background:${C.espresso};padding:24px 28px;">
          <h1 style="margin:0;font-size:24px;font-weight:700;color:${C.mozzarella};
                     font-family:Georgia,'Times New Roman',serif;line-height:1.2;
                     letter-spacing:.01em;">Grazie!</h1>
          <div style="margin-top:12px;height:2px;width:40px;background:${C.salmon};
                      border-radius:1px;"></div>
        </div>

        <div style="padding:24px 28px 28px;">
          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.espresso};
                    font-family:Arial,Helvetica,sans-serif;">
            Guten Tag ${escHtml(payload.name)},<br>${escHtml(intro)}
          </p>

          <p style="margin:0 0 12px;font-size:13px;color:${C.textMuted};
                    font-family:Arial,Helvetica,sans-serif;">
            Zur Sicherheit hier noch einmal alles, was Sie uns geschickt haben —
            vollständig und ungekürzt:
          </p>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                 style="width:100%;border-collapse:collapse;">
            ${metaRows}
          </table>

          ${messageBlock}

          <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:${C.textMuted};
                    font-family:Arial,Helvetica,sans-serif;">
            Stimmt etwas nicht? Antworten Sie einfach auf diese Mail oder
            rufen Sie uns an:
            <a href="tel:${escHtml(LEGAL.contact.phone.replace(/[^\d+]/g, ""))}"
               style="color:${C.salmon};text-decoration:none;white-space:nowrap;">${escHtml(LEGAL.contact.phone)}</a>.
          </p>
        </div>

        <div style="padding:14px 28px;background:${C.bgMuted};
                    border-top:1px solid ${C.border};">
          <p style="margin:0;font-size:11px;color:${C.textMuted};
                    font-family:Arial,Helvetica,sans-serif;">
            Ristorante Goldoni · Stuttgart-West ·
            <a href="https://ristorante-goldoni.de"
               style="color:${C.salmon};text-decoration:none;">ristorante-goldoni.de</a>
          </p>
        </div>
      </div>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Plaintext twin of `buildCustomerHtmlMail`. */
export function buildCustomerTextMail(payload: InquiryPayload): string {
  const isFeiern = payload.type === "feiern";
  const intro = isFeiern
    ? "wir haben Ihre Feieranfrage erhalten und melden uns telefonisch, um die Details zu besprechen."
    : "wir haben Ihre Nachricht erhalten und melden uns zeitnah bei Ihnen.";

  const lines: string[] = [
    "GRAZIE!",
    "=".repeat(50),
    "",
    `Guten Tag ${payload.name},`,
    intro,
    "",
    "Zur Sicherheit hier noch einmal alles, was Sie uns geschickt haben —",
    "vollständig und ungekürzt:",
    "",
    `Name:        ${payload.name}`,
    `E-Mail:      ${payload.email}`,
  ];

  if (payload.phone) lines.push(`Telefon:     ${payload.phone}`);

  if (isFeiern) {
    const p = payload as FeiernPayload;
    lines.push(`Anlass:      ${p.occasion}`);
    lines.push(`Datum:       ${p.date}`);
    lines.push(`Gäste:       ${p.guestCount}`);
    if (p.preferredTime) lines.push(`Wunschzeit:  ${p.preferredTime}`);
  }

  lines.push(`Gesendet am: ${nowLocal()}`);

  if (payload.message) {
    lines.push("");
    lines.push("Ihre Nachricht:");
    lines.push("-".repeat(30));
    lines.push(payload.message);
  }

  lines.push("");
  lines.push(
    `Stimmt etwas nicht? Antworten Sie auf diese Mail oder rufen Sie uns an: ${LEGAL.contact.phone}`,
  );
  lines.push("");
  lines.push("Ristorante Goldoni · Stuttgart-West · ristorante-goldoni.de");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Plaintext template (fallback)
// ---------------------------------------------------------------------------

export function buildTextMail(payload: InquiryPayload): string {
  const isFeiern = payload.type === "feiern";
  const submittedAt = nowIso();
  const submittedAtLocal = nowLocal();

  const lines: string[] = [
    isFeiern
      ? `FEIERANFRAGE: ${payload.occasion} (${payload.name})`
      : `KONTAKTANFRAGE VON ${payload.name}`,
    "=".repeat(50),
    "",
    `Name:       ${payload.name}`,
    `E-Mail:     ${payload.email}`,
  ];

  if (payload.phone) lines.push(`Telefon:    ${payload.phone}`);

  if (isFeiern) {
    const p = payload as FeiernPayload;
    lines.push(`Anlass:     ${p.occasion}`);
    lines.push(`Datum:      ${p.date}`);
    lines.push(`Gäste:      ${p.guestCount}`);
    if (p.preferredTime) lines.push(`Wunschzeit: ${p.preferredTime}`);
  }

  lines.push(`Eingegangen: ${submittedAtLocal}`);

  if (payload.message) {
    lines.push("");
    lines.push("Nachricht:");
    lines.push("-".repeat(30));
    lines.push(payload.message);
  }

  // JSON block
  const jsonData: Record<string, unknown> = {
    type: payload.type,
    name: payload.name,
    email: payload.email,
    phone: payload.phone ?? null,
    message: payload.message ?? null,
    ...(isFeiern && {
      occasion: (payload as FeiernPayload).occasion,
      date: (payload as FeiernPayload).date,
      guestCount: (payload as FeiernPayload).guestCount,
      preferredTime: (payload as FeiernPayload).preferredTime ?? null,
    }),
    submittedAt,
    submittedAtLocal,
    source: "ristorante-goldoni.de",
  };

  lines.push("");
  lines.push("=".repeat(50));
  lines.push("JSON (maschinell verarbeitbar)");
  lines.push("=".repeat(50));
  lines.push(JSON.stringify(jsonData, null, 2));

  return lines.join("\n");
}
