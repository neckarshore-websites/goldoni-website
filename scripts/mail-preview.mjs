/**
 * Mail preview — renders every inquiry mail template to HTML files you
 * can open in a browser.
 *
 * WHY: mail templates are the only user-facing surface with no visual
 * check in CI. Lighthouse doesn't audit an email, and the e2e suite runs
 * the action in dry-run so no mail is ever built end-to-end. Until this
 * script existed, the only way to see a template was to trigger a real
 * inquiry in production — i.e. to find layout bugs *after* a guest did.
 * The phone number breaking mid-digits ("+49 (711)" / "659 98 89") was
 * found exactly this way, by eye, after it had shipped.
 *
 * Usage:  npm run mail:preview   → writes to .mail-preview/ and lists them
 *
 * The 2000-char fixture matters most: it is the worst realistic case
 * (the limit the forms now enforce) and it is where a template either
 * holds its shape or falls apart.
 */

import fs from "node:fs";
import path from "node:path";
import {
  buildCustomerHtmlMail,
  buildCustomerTextMail,
  buildHtmlMail,
  buildTextMail,
} from "../src/lib/email-html.ts";
import { LIMITS } from "../src/lib/limits.ts";

const OUT = ".mail-preview";

/** A realistic German celebration brief, padded to exactly LIMITS.message. */
function maxLengthMessage() {
  const real =
    "Zwei unserer Gäste haben eine schwere Nussallergie — bitte unbedingt " +
    "an die Küche weitergeben, auch für Desserts und Saucen. Eine Person " +
    "isst vegetarisch, eine weitere glutenfrei.\n\n" +
    "Wir hätten gern das Menü mit Vitello Tonnato als Vorspeise, danach " +
    "die Ravioli und als Hauptgang das Kalb. Beim Dessert würden wir uns " +
    "über Tiramisu freuen, falls möglich zusätzlich eine glutenfreie " +
    "Alternative.\n\n" +
    "Zum Ablauf: Wir kommen gegen 18:00 Uhr, der Sektempfang sollte im " +
    "hinteren Bereich stattfinden. Gegen 19:00 Uhr möchten wir mit dem " +
    "Essen beginnen. Es gibt zwei kurze Reden, jeweils etwa fünf Minuten, " +
    "die erste vor der Vorspeise, die zweite vor dem Dessert.\n\n" +
    "Wir bringen eigene Tischdekoration mit und würden gern ab 16:00 Uhr " +
    "aufbauen. Ist das möglich? Außerdem bräuchten wir eine Steckdose für " +
    "die Musikanlage in der Nähe des Fensters.\n\n" +
    "Falls das Wetter mitspielt, wäre uns der Aperitif draußen sehr " +
    "recht. Bitte sagen Sie uns, ob das kurzfristig entscheidbar ist.\n\n";
  // Pad with sentence-shaped filler so wrapping behaves like real prose.
  const filler = "Vielen Dank für Ihre Rückmeldung. ";
  let out = real;
  while (out.length < LIMITS.message) out += filler;
  return out.slice(0, LIMITS.message);
}

const longMessage = maxLengthMessage();

const feiernMax = {
  type: "feiern",
  name: "Familie Weber",
  email: "weber@example.com",
  phone: "+49 711 4455667",
  occasion: "Hochzeit",
  date: "2026-09-12",
  guestCount: 30,
  preferredTime: "ab 18:00",
  message: longMessage,
};

const kontaktMax = {
  type: "kontakt",
  name: "Familie Weber",
  email: "weber@example.com",
  phone: "+49 711 4455667",
  message: longMessage,
};

const feiernShort = {
  ...feiernMax,
  message: "Zwei Gäste mit Nussallergie, bitte beachten.",
};

const CASES = [
  ["customer-feiern-2000", buildCustomerHtmlMail, feiernMax],
  ["customer-kontakt-2000", buildCustomerHtmlMail, kontaktMax],
  ["customer-feiern-short", buildCustomerHtmlMail, feiernShort],
  ["owner-feiern-2000", buildHtmlMail, feiernMax],
  ["owner-kontakt-2000", buildHtmlMail, kontaktMax],
];

fs.mkdirSync(OUT, { recursive: true });

for (const [name, build, payload] of CASES) {
  const file = path.join(OUT, `${name}.html`);
  fs.writeFileSync(file, build(payload));
  console.log(`  ${file}`);
}

// Plaintext twins — the fallback real clients use more often than we think.
fs.writeFileSync(
  path.join(OUT, "customer-feiern-2000.txt"),
  buildCustomerTextMail(feiernMax),
);
fs.writeFileSync(
  path.join(OUT, "owner-feiern-2000.txt"),
  buildTextMail(feiernMax),
);
console.log(`  ${OUT}/customer-feiern-2000.txt`);
console.log(`  ${OUT}/owner-feiern-2000.txt`);

console.log(
  `\n${CASES.length} HTML + 2 text previews written.` +
    `\nMessage fixture: ${longMessage.length} chars (limit ${LIMITS.message}).`,
);
