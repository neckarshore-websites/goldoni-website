import { SITE, STOREFRONT_PARTNER } from "./site";

/**
 * E-Mail-Signaturen für Ristorante Goldoni.
 *
 * WARUM DAS MARKUP SO ALTMODISCH AUSSIEHT
 *
 * Signaturen laufen in Outlook, Apple Mail, Gmail und Thunderbird, nicht im
 * Browser. Daraus folgt ohne Ausnahme:
 *
 * - Layout über `<table>`, nicht Flexbox oder Grid. Outlook rendert mit der
 *   Word-Engine und kennt beides nicht.
 * - Ausschliesslich Inline-Styles. Gmail entfernt `<style>`-Blöcke.
 * - Absolute Bild-URLs. Ein relativer Pfad zeigt im Postfach ins Leere.
 * - Systemschriften. Webfonts werden nicht geladen; die Website-Schriften
 *   (Inter, Playfair) sind hier nicht verfügbar.
 * - Feste Pixelwerte. `rem` ist unzuverlässig, Media Queries greifen kaum.
 * - Keine Hintergrundbilder, kein `border-radius` als tragendes Element —
 *   Outlook ignoriert es und die Fläche wird eckig.
 *
 * Alle Kontaktdaten kommen aus `SITE`, der Bestell-Link aus
 * `STOREFRONT_PARTNER`. Eine Signatur wird tausendfach verschickt und ist
 * praktisch nicht zurückzuholen — sie darf keine zweite, abschreibbare Kopie
 * der Telefonnummer sein.
 */

const ACCENT = "#B64926"; // tavola.salmon
const INK = "#1A1612"; // tavola.espresso
const MUTED = "#5C5240";
const HAIRLINE = "#EAE0C5";
const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const abs = (path: string) => `${SITE.url}${path}`;
const QR_SRC = abs("/images/storefront-qr-mail.png");

/**
 * Rolle bewusst NICHT gesetzt. Die Quellen sagen „Vertretungsberechtigter"
 * (Storefront-Impressum) und „Mit-Eigentümer" (Repo-CLAUDE.md) — das ist nicht
 * dasselbe wie „Inhaber", und eine Funktionsbezeichnung in einer Signatur ist
 * eine Rechtsangabe, die ich nicht errate. Wer sie will, trägt sie hier ein.
 */
const PERSON = "Silvio Nicola Brunetti";
const ROLE = "";

const link = (href: string, text: string, color = ACCENT) =>
  `<a href="${href}" style="color:${color};text-decoration:none;">${text}</a>`;

function qrCell(size: number) {
  return `<td style="padding:0 0 0 24px;vertical-align:top;">
        <a href="${STOREFRONT_PARTNER.url}" style="text-decoration:none;">
          <img src="${QR_SRC}" width="${size}" height="${size}" alt="QR-Code zur Online-Bestellung bei Ristorante Goldoni" style="display:block;border:0;outline:none;width:${size}px;height:${size}px;" />
        </a>
        <div style="font-family:${FONT};font-size:10px;line-height:14px;color:${MUTED};text-align:center;padding-top:4px;width:${size}px;">Direkt bestellen</div>
      </td>`;
}

const contactBlock = `<div style="font-family:${FONT};font-size:13px;line-height:20px;color:${MUTED};">
        ${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}<br />
        Tel. ${link(`tel:${SITE.phone.replace(/\s/g, "")}`, SITE.phoneDisplay, MUTED)}
        &nbsp;&middot;&nbsp;
        ${link(`mailto:${SITE.email}`, SITE.email, MUTED)}<br />
        ${link(SITE.url, SITE.url.replace("https://", ""))}
      </div>`;

/**
 * Variante A — kompakt.
 *
 * Für den Alltag: Name, Restaurant, Kontakt, QR. Eine Haarlinie in
 * Goldoni-Salmon als einziger Farbakzent, damit die Signatur auch in einem
 * schwarzweissen Ausdruck sauber aussieht.
 */
export const SIGNATURE_A = `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr>
    <td style="padding:0;vertical-align:top;border-left:3px solid ${ACCENT};padding-left:14px;">
      <div style="font-family:${FONT};font-size:15px;line-height:22px;color:${INK};font-weight:bold;">${PERSON}${ROLE ? `<span style="font-weight:normal;color:${MUTED};"> &middot; ${ROLE}</span>` : ""}</div>
      <div style="font-family:${FONT};font-size:14px;line-height:20px;color:${ACCENT};padding-bottom:8px;">${SITE.name} &middot; ${SITE.tagline}</div>
      ${contactBlock}
    </td>
    ${qrCell(96)}
  </tr>
</table>`;

/**
 * Variante B — ausführlich.
 *
 * Zusätzlich Öffnungszeiten und ein ausgeschriebener Bestell-Hinweis. Für
 * Gästekorrespondenz, wo genau diese Fragen ohnehin gestellt werden. Der
 * Unterschied zu A ist deshalb inhaltlich, nicht dekorativ.
 *
 * Die Öffnungszeiten kommen aus `SITE.hours` — dieselbe Quelle wie die
 * Fussleiste der Website. Sie beschreiben den Gastraum; das Lieferfenster der
 * Storefront ist bewusst weiter (siehe site.ts).
 */
export const SIGNATURE_B = `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr>
    <td colspan="2" style="padding:0 0 10px 0;">
      <div style="font-family:${FONT};font-size:17px;line-height:24px;color:${INK};font-weight:bold;letter-spacing:0.2px;">${SITE.name}</div>
      <div style="font-family:${FONT};font-size:12px;line-height:18px;color:${ACCENT};text-transform:uppercase;letter-spacing:1.4px;">${SITE.tagline}</div>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding:0 0 12px 0;"><div style="height:2px;background-color:${ACCENT};font-size:0;line-height:0;">&nbsp;</div></td>
  </tr>
  <tr>
    <td style="padding:0;vertical-align:top;">
      <div style="font-family:${FONT};font-size:14px;line-height:20px;color:${INK};font-weight:bold;padding-bottom:6px;">${PERSON}${ROLE ? `<span style="font-weight:normal;color:${MUTED};"> &middot; ${ROLE}</span>` : ""}</div>
      ${contactBlock}
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:10px;border-top:1px solid ${HAIRLINE};">
        ${SITE.hours
          .map(
            (h) =>
              `<tr>
          <td style="font-family:${FONT};font-size:12px;line-height:18px;color:${MUTED};padding:4px 14px 0 0;white-space:nowrap;">${h.days}</td>
          <td style="font-family:${FONT};font-size:12px;line-height:18px;color:${INK};padding:4px 0 0 0;white-space:nowrap;">${h.time.replace(/ & /g, "&nbsp;&amp; ")}</td>
        </tr>`,
          )
          .join("\n        ")}
      </table>
      <div style="font-family:${FONT};font-size:13px;line-height:20px;color:${INK};padding-top:10px;">
        ${link(STOREFRONT_PARTNER.url, "&#9679; Jetzt online bestellen")}
      </div>
    </td>
    ${qrCell(110)}
  </tr>
</table>`;

/**
 * Vollständiges HTML-Dokument um eine Signatur herum.
 *
 * Wird für die Dateien unter /signaturen UND für die Vorschau-iframes benutzt.
 * Das iframe ist kein Umweg, sondern die genauere Darstellung: innerhalb der
 * Seite würde die Signatur den CSS-Reset der Website erben und damit anders
 * aussehen als im Postfach. Ein eigenes Dokument zeigt, was ankommt.
 */
export function signatureDocument(html: string, titel: string): string {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>E-Mail-Signatur ${titel} — Ristorante Goldoni</title>
</head>
<body style="margin:0;padding:20px;background:#ffffff;">
<!--
  Alles unterhalb dieses Kommentars markieren und in die Signatur-Einstellungen
  des Mailprogramms einfügen (Outlook: Datei > Optionen > E-Mail > Signaturen;
  Apple Mail: Mail > Einstellungen > Signaturen).
-->
${html}
</body>
</html>
`;
}

export const SIGNATURES = [
  {
    id: "a",
    titel: "Variante A — kompakt",
    beschreibung:
      "Für den Alltag. Name, Restaurant, Kontakt, QR-Code. Ein einziger Farbakzent als Haarlinie, damit sie auch schwarzweiss gedruckt sauber bleibt.",
    html: SIGNATURE_A,
    /** Feste Vorschauhöhe — ohne JavaScript kann sich ein iframe nicht selbst messen. */
    previewHeight: 190,
  },
  {
    id: "b",
    titel: "Variante B — ausführlich",
    beschreibung:
      "Für Gästekorrespondenz. Zusätzlich Öffnungszeiten und ein ausgeschriebener Bestell-Hinweis — genau die Fragen, die in solchen Mails ohnehin gestellt werden.",
    html: SIGNATURE_B,
    previewHeight: 320,
  },
];
