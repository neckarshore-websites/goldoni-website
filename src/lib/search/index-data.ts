import speisekarte from "@/data/speisekarte.json";
import empfehlungskarte from "@/data/empfehlungskarte.json";
import wines from "@/data/weinempfehlungen.json";
import { FAQS } from "@/data/faqs";
import type { Menu } from "@/lib/menu";
import type { SearchDoc, SearchType } from "./types";

/** German-aware slug: umlauts → ASCII, lowercase, hyphen-separated.
 *  Used for FAQ ids/anchors — must match the id rendered in FaqSection. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const DIET_LABEL: Record<string, string> = {
  vegetarian: "vegetarisch",
  vegan: "vegan",
  spicy: "scharf",
};

// Curated index of the public pages. Mirrors each route's `pageMetadata`
// (src/app/<route>/page.tsx) — kept here so the index needs no JSX scraping.
const PAGES: { title: string; description: string; url: string }[] = [
  {
    title: "Startseite",
    description:
      "Ristorante Goldoni — Bella Italia in Stuttgart. Italienisch verliebte Küche im Stuttgarter Westen, Sonntags-Mittagstisch, Lieferung über Wolt und Uber Eats.",
    url: "/",
  },
  {
    title: "Speisekarte",
    description:
      "Antipasti, Pasta, Pizze, Hauptgerichte und Dolci im Ristorante Goldoni in Stuttgart. Italienisch verliebte Küche, frische Zutaten.",
    url: "/menu",
  },
  {
    title: "Empfehlungskarte",
    description:
      "Saisonale Gerichte, Wochenangebote und Wein-Tipps aus der Küche im Ristorante Goldoni.",
    url: "/empfehlungen",
  },
  {
    title: "Feiern bei Goldoni",
    description:
      "Hochzeiten, Geburtstage, Taufen, Firmenfeiern — private Anlässe im Ristorante Goldoni in Stuttgart, mit individueller Karte.",
    url: "/feiern",
  },
  {
    title: "Über uns",
    description:
      "Silvio Brunetti führt das Ristorante Goldoni im Stuttgarter Westen — gehobene italienische Küche zu angemessenen Preisen, kuratierte Weine, ein denkmalgeschütztes Jugendstil-Haus mit über 120 Jahren Gastgeschichte.",
    url: "/ueber-uns",
  },
  {
    title: "Kontakt",
    description:
      "Fragen, Sonderwünsche oder eine kurze Nachricht — schreiben Sie dem Ristorante Goldoni direkt. Adresse, Telefon, Öffnungszeiten.",
    url: "/kontakt",
  },
  {
    title: "Impressum",
    description: "Anbieterkennzeichnung gemäß § 5 DDG.",
    url: "/impressum",
  },
  {
    title: "Datenschutzerklärung",
    description:
      "Informationen zur Verarbeitung personenbezogener Daten gemäß Art. 13 DSGVO.",
    url: "/datenschutz",
  },
];

/** Build menu/empfehlung docs from a Menu, deep-linked to a category anchor. */
function menuDocs(menu: Menu, type: SearchType, basePath: string): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const cat of menu.categories) {
    const category = cat.subtitle ? `${cat.name} · ${cat.subtitle}` : cat.name;
    for (const item of cat.items) {
      const diet = (item.diet ?? []).map((d) => DIET_LABEL[d] ?? d).join(" ");
      docs.push({
        id: `${type}:${cat.id}:${slugify(item.name)}`,
        type,
        title: item.name,
        text: [item.description ?? "", diet].filter(Boolean).join(" ").trim(),
        category,
        url: `${basePath}#${cat.id}`,
      });
    }
  }
  return docs;
}

type Wine = {
  name: string;
  producer?: string;
  region?: string;
  grapes?: string;
  classification?: string;
};
type WineData = { weiss?: Wine[]; rot?: Wine[]; hauswein?: Record<string, Wine[]> };

const HAUSWEIN_LABEL: Record<string, string> = {
  weiss: "Hauswein weiß",
  rot: "Hauswein rot",
  rosato: "Hauswein rosé",
};

function wineDoc(w: Wine, label: string, hauswein: boolean): SearchDoc {
  return {
    id: `wine:${slugify(label)}:${slugify(w.name)}`,
    type: "wine",
    title: w.name,
    text: [w.producer, w.region, w.grapes, w.classification, hauswein ? "Hauswein offen" : ""]
      .filter(Boolean)
      .join(" "),
    category: `Wein · ${label}`,
    url: "/empfehlungen",
  };
}

/** Build the full searchable document set across pages + all culinary content. */
export function buildSearchDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const p of PAGES) {
    docs.push({
      id: `page:${p.url}`,
      type: "page",
      title: p.title,
      text: p.description,
      category: "Seite",
      url: p.url,
    });
  }

  docs.push(...menuDocs(speisekarte as Menu, "menu", "/menu"));
  docs.push(...menuDocs(empfehlungskarte as Menu, "empfehlung", "/empfehlungen"));

  const wineData = wines as WineData;
  for (const w of wineData.weiss ?? []) docs.push(wineDoc(w, "Weißwein", false));
  for (const w of wineData.rot ?? []) docs.push(wineDoc(w, "Rotwein", false));
  for (const [colour, list] of Object.entries(wineData.hauswein ?? {})) {
    const label = HAUSWEIN_LABEL[colour] ?? `Hauswein ${colour}`;
    for (const w of list) docs.push(wineDoc(w, label, true));
  }

  for (const faq of FAQS) {
    docs.push({
      id: `faq:${slugify(faq.question)}`,
      type: "faq",
      title: faq.question,
      text: faq.answer,
      category: "FAQ",
      url: `/#${slugify(faq.question)}`,
    });
  }

  return docs;
}
