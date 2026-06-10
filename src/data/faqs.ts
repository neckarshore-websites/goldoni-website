/**
 * FAQ — single source of truth for the homepage FAQ section
 * and the matching FAQPage JSON-LD.
 *
 * Editing rules:
 *  - Keep answers short (1-3 sentences). Google truncates rich
 *    snippets at ~300 chars; longer answers lose preview real estate.
 *  - Prefer plain text. The renderer strips formatting for the
 *    JSON-LD payload, but the on-page version supports inline links
 *    via React children — see FaqSection for the rendering contract.
 *  - Order matters: top entries get the most attention in both UI
 *    and search results. Put the most-asked first.
 *  - When you change an entry, no code change needed — just edit
 *    here and ship a commit.
 */

import { SITE } from "@/lib/site";

export type Faq = {
  /** Displayed as <summary> and used as the JSON-LD Question name. */
  question: string;
  /**
   * Plain-text answer used in JSON-LD. Keep it self-contained — the
   * search-result preview shows this verbatim.
   */
  answer: string;
};

export const FAQS: readonly Faq[] = [
  {
    question: "Wann hat das Ristorante Goldoni geöffnet?",
    answer:
      "Mittwoch bis Sonntag von 18:00 bis 22:30 Uhr. Sonntags zusätzlich Mittagstisch von 11:30 bis 14:30 Uhr. Montag und Dienstag haben wir geschlossen.",
  },
  {
    question: "Wie kann ich einen Tisch reservieren?",
    answer: `Am liebsten per Telefon unter ${SITE.phoneDisplay}. Wir nehmen Reservierungen während unserer Öffnungszeiten entgegen — Mi–So ab 18:00 Uhr und sonntags zum Mittagstisch (11:30–14:30 Uhr).`,
  },
  {
    question: "Bietet das Goldoni Lieferung an?",
    answer:
      "Ja — über Wolt und Uber Eats. Beide Partner liefern in den Stuttgarter Westen und angrenzende Stadtteile. Die Bestelllinks sind auf unserer Startseite verlinkt.",
  },
  {
    question: "Wo liegt das Ristorante Goldoni?",
    answer: `Reinsburgstrasse 151, ${SITE.address.postalCode} ${SITE.address.city}, Stuttgart-West. Die Bus-Haltestelle (Linie 92) ist direkt vor der Tür.`,
  },
  {
    question: "Wie sind Allergene auf der Speisekarte gekennzeichnet?",
    answer:
      "Wir kennzeichnen Allergene nach LMIV (Lebensmittel-Informationsverordnung) mit Buchstabencodes hinter jedem Gericht. Eine vollständige Legende finden Sie unten auf der Speisekarte.",
  },
] as const;
