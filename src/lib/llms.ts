/**
 * llms.txt — built from the same data the pages render, never hand-written.
 *
 * Why generated: the hand-written public/llms.txt of 2026-04-29 was never
 * touched again. By 2026-09-23 it stated wrong opening hours ("Mi–So 18–23"),
 * a family-history claim nothing in the repo supports, and it described the
 * weekly menu — the card guests actually order from most — as a side note.
 * A text an AI engine quotes to guests must not be able to drift from the
 * site, so every fact below comes from `site.ts` or the menu JSON.
 *
 * Two languages: `/llms.txt` (German, primary, the conventional path that
 * crawlers look for) and `/llms-en.txt` (English). Each links the other.
 *
 * Format: https://llmstxt.org — H1, blockquote summary, then H2 link lists.
 */
import { SITE } from "@/lib/site";
import type { Menu } from "@/lib/menu";
import empfehlungskarte from "@/data/empfehlungskarte.json";
import weine from "@/data/weinempfehlungen.json";

export type LlmsLang = "de" | "en";

const WEEKLY = empfehlungskarte as Menu;

const DAYS_EN: Record<string, string> = {
  "Mi - Sa": "Wednesday to Saturday",
  So: "Sunday",
  "Mo + Di": "Monday and Tuesday",
};
const DAYS_DE: Record<string, string> = {
  "Mi - Sa": "Mittwoch bis Samstag",
  So: "Sonntag",
  "Mo + Di": "Montag und Dienstag",
};

/** "18:00 - 22:30" -> "18:00–22:30"; "geschlossen" -> localized "closed". */
function timeText(time: string, lang: LlmsLang): string {
  if (time === "geschlossen") return lang === "de" ? "geschlossen" : "closed";
  return time.replace(/\s*-\s*/g, "–").replace(/\s*&\s*/g, lang === "de" ? " und " : " and ");
}

export function hoursLine(lang: LlmsLang): string {
  const names = lang === "de" ? DAYS_DE : DAYS_EN;
  return SITE.hours
    .map((h) => {
      const days = names[h.days];
      if (!days) throw new Error(`llms: unknown day group "${h.days}" in SITE.hours`);
      const t = timeText(h.time, lang);
      return h.time === "geschlossen" ? `${days} ${t}` : `${days} ${t}${lang === "de" ? " Uhr" : ""}`;
    })
    .join("; ");
}

/** "15.50" -> "15,50 €" (de) / "EUR 15.50" (en). */
function price(p: string, lang: LlmsLang): string {
  return lang === "de" ? `${p.replace(".", ",")} €` : `EUR ${p}`;
}

function isoToDe(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function weeklyDishes(lang: LlmsLang): string[] {
  const out: string[] = [];
  for (const cat of WEEKLY.categories) {
    out.push("");
    out.push(`### ${cat.name}${cat.subtitle ? ` (${cat.subtitle})` : ""}`);
    out.push("");
    for (const it of cat.items) {
      const desc = it.description ? ` — ${it.description}` : "";
      out.push(`- ${it.name}${desc}: ${price(it.price, lang)}`);
    }
  }
  return out;
}

function wineLines(lang: LlmsLang): string[] {
  const all = [...weine.weiss, ...weine.rot];
  return all.map((w) => {
    const label = [w.producer, w.name].filter((s) => s && s !== "").join(" ");
    const glass = lang === "de" ? `0,2 l ${w.priceGlass} €` : `0.2 l EUR ${w.priceGlass.replace(",", ".")}`;
    const bottle = lang === "de" ? `0,75 l ${w.priceBottle} €` : `0.75 l EUR ${w.priceBottle.replace(",", ".")}`;
    return `- ${label} ${w.classification} ${w.year} (${w.region}, ${w.grapes}): ${bottle}, ${glass}`;
  });
}

export function buildLlmsTxt(lang: LlmsLang): string {
  const u = SITE.url;
  const a = SITE.address;
  const delivery = SITE.delivery;
  const own = delivery.find((d) => d.channel === "own");
  const markets = delivery.filter((d) => d.channel === "marketplace").map((d) => d.name);
  const updated = lang === "de" ? isoToDe(WEEKLY.updated) : WEEKLY.updated;

  if (lang === "de") {
    return [
      `# ${SITE.name}`,
      "",
      `> Italienisches Restaurant im Stuttgarter Westen. Italienisch verliebte Küche mit frischen Zutaten — Antipasti, Pasta, Pizze, Carne e Pesce, Dolci. Neben der festen Speisekarte gibt es jede Woche eine eigene Speisekarte der Woche (Empfehlungskarte), aus der Stammgäste besonders gern bestellen.`,
      "",
      `Adresse: ${a.street}, ${a.postalCode} ${a.city}, Deutschland.`,
      `Öffnungszeiten: ${hoursLine("de")}.`,
      `Telefon (auch für Reservierungen): ${SITE.phone}.`,
      `E-Mail: ${SITE.email}.`,
      own ? `Online bestellen (Abholung und Lieferung): ${own.url}` : "",
      markets.length ? `Außerdem bei: ${markets.join(", ")}.` : "",
      `ÖPNV: ${SITE.transit.type} ${SITE.transit.line}, ${SITE.transit.note}.`,
      "",
      "## Speisekarten",
      "",
      `- [Speisekarte der Woche (Empfehlungskarte)](${u}/empfehlungen): Die wöchentlich wechselnde Karte der Küche mit Vorspeisen, Pasta, Pizza, Hauptgerichten, Desserts und Weinempfehlungen. Aktueller Stand: ${updated}.`,
      `- [Speisekarte](${u}/menu): Die feste Karte mit Antipasti, Pasta, Pizze, Hauptgerichten, Dolci und Getränken — mit Preisen und Allergenkennzeichnung.`,
      "",
      `## Speisekarte der Woche, Stand ${updated}`,
      ...weeklyDishes("de"),
      "",
      "### Weinempfehlung",
      "",
      ...wineLines("de"),
      "",
      "Allergene und Zusatzstoffe stehen an jedem Gericht auf der Website; Änderungen vorbehalten.",
      "",
      "## Weitere Seiten",
      "",
      `- [Startseite](${u}/): Überblick, Öffnungszeiten, Bestellen, häufige Fragen.`,
      `- [Feiern](${u}/feiern): Private Anlässe — Hochzeiten, Geburtstage, Taufen, Firmenfeiern. Mit Anfrageformular.`,
      `- [Über uns](${u}/ueber-uns): Das Restaurant und seine Küche.`,
      `- [Kontakt](${u}/kontakt): Adresse, Anfahrt, Telefon, Kontaktformular.`,
      "",
      "## Optional",
      "",
      `- [English version](${u}/llms-en.txt)`,
      `- [Impressum](${u}/impressum): Anbieterkennzeichnung gemäß § 5 DDG.`,
      `- [Datenschutz](${u}/datenschutz): Datenverarbeitung gemäß Art. 13 DSGVO.`,
      "",
    ]
      .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""))
      .join("\n");
  }

  return [
    `# ${SITE.name}`,
    "",
    `> Italian restaurant in the west of Stuttgart, Germany. Italian cooking with fresh ingredients — antipasti, pasta, pizza, meat and fish, desserts. Besides the regular menu, the kitchen publishes a weekly menu (German: "Empfehlungskarte") every week; it is the menu regular guests order from most.`,
    "",
    `Address: ${a.street}, ${a.postalCode} ${a.city}, Germany.`,
    `Opening hours: ${hoursLine("en")}.`,
    `Phone (also for reservations): ${SITE.phone}.`,
    `Email: ${SITE.email}.`,
    own ? `Order online (pickup and delivery): ${own.url}` : "",
    markets.length ? `Also available on: ${markets.join(", ")}.` : "",
    `Public transport: ${SITE.transit.type} ${SITE.transit.line}, stop directly in front of the restaurant.`,
    "The website is in German; dish names are Italian with German descriptions.",
    "",
    "## Menus",
    "",
    `- [Weekly menu (Empfehlungskarte)](${u}/empfehlungen): The kitchen's menu of the week — starters, pasta, pizza, mains, desserts and wine recommendations. Current as of ${updated}.`,
    `- [Menu (Speisekarte)](${u}/menu): The regular menu — antipasti, pasta, pizza, mains, desserts and drinks, with prices and allergen labelling.`,
    "",
    `## Weekly menu as of ${updated}`,
    "",
    "Dish descriptions are quoted in German as printed by the restaurant.",
    ...weeklyDishes("en"),
    "",
    "### Wine recommendations",
    "",
    ...wineLines("en"),
    "",
    "Allergens and additives are listed with every dish on the website; subject to change.",
    "",
    "## Other pages",
    "",
    `- [Home](${u}/): Overview, opening hours, ordering, FAQ.`,
    `- [Celebrations (Feiern)](${u}/feiern): Private events — weddings, birthdays, christenings, company parties. With enquiry form.`,
    `- [About us (Über uns)](${u}/ueber-uns): The restaurant and its kitchen.`,
    `- [Contact (Kontakt)](${u}/kontakt): Address, directions, phone, contact form.`,
    "",
    "## Optional",
    "",
    `- [Deutsche Version](${u}/llms.txt)`,
    `- [Legal notice (Impressum)](${u}/impressum)`,
    `- [Privacy policy (Datenschutz)](${u}/datenschutz)`,
    "",
  ]
    .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""))
    .join("\n");
}
