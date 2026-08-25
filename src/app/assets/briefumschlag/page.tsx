import type { Metadata } from "next";
import { BriefumschlagArtwork } from "@/components/artwork/PrintArtwork";
import { PrintSpecPage } from "@/components/PrintSpecPage";

export const metadata: Metadata = {
  title: "Briefumschlag — Ristorante Goldoni (intern)",
  robots: { index: false, follow: false },
};

const PRINTER_NOTE = `HINWEISE ZUR DATEI — Ristorante Goldoni, Briefumschlag DIN lang quer

Einseitig, nur Schwarz (1/0). Bitte 100 % Schwarz drucken, C 0 / M 0 /
Y 0 / K 100 — kein Vierfarbschwarz, das Produkt ist einfarbig.

Die Datei liegt in RGB vor; die enthaltenen Elemente sind reines Schwarz
und Weiss, eine Wandlung nach Graustufen bzw. K verlaendert das Bild
nicht.

Datenformat 230 x 120 mm, eine Seite. Es gibt bewusst KEINE
Vollton-Flaechen: auf 80-g-Offsetpapier schlaegt eine grosse schwarze
Flaeche durch und macht den Umschlag wellig.

Freigehalten sind: das Fenster (90 x 45 mm, 20 mm von links und 15 mm von
unten ab Endformat) samt 2 mm ringsum wegen des im Datenblatt genannten
Versatzes von rund 1 mm, sowie das Briefmarkenfeld oben rechts.

Schriften sind eingebettet, saemtliche Inhalte sind Vektor.`;

export default function Page() {
  return (
    <PrintSpecPage
      navKey="briefumschlag"
      eyebrow="Drucksachen"
      title="Briefumschlag"
      intro="DIN lang quer mit Fenster, haftklebend. Für Rechnungen, Gutscheine und Post an Gäste — das Stück, das im Briefkasten landet, bevor irgendjemand die Website kennt."
      status="Entwurf in Oliv — setzt die 4/0-Variante voraus, siehe offene Punkte"
      aspect={{ w: 1600, h: 835 }}
      sides={[
        {
          label: "Vorderseite",
          caption: "Fenster und Briefmarkenfeld bleiben unbedruckt",
          node: <BriefumschlagArtwork />,
        },
      ]}
      specs={[
        ["Endformat", "220 × 110 mm (DIN lang quer)"],
        ["Datenformat", "230 × 120 mm"],
        ["Beschnitt", "5 mm, im Datenformat enthalten"],
        ["Sicherheitsabstand", "3 mm ab Endformat"],
        ["Fenster", "90 × 45 mm, 20 mm von links, 15 mm von unten"],
        ["Fenster-Toleranz", "ca. 1 mm Versatz laut Datenblatt"],
        ["Papier", "80 g/m² Offset weiss, beschreibbar, laser- und tintenstrahlgeeignet"],
        ["Verschluss", "haftklebend, innenliegende Seitenklappen"],
        ["Druck", "aktuell gewählt 1/0 (nur Schwarz) — dieser Entwurf braucht 4/0"],
      ]}
      decisions={[
        {
          title: "Dieselbe Sprache wie Postkarte und Bierdeckel",
          body: "Betreiber-Entscheidung 2026-08-25: Oliv und Espresso auf allen Drucksachen. Der Umschlag trägt deshalb dieselbe Wortmarke, dieselbe Fläche, dieselben Farben — er ist bei vielen Gästen der erste Kontakt mit dem Haus, oft bevor sie die Website kennen.",
        },
        {
          title: "Der Preis dieser Entscheidung: 4/0 statt 1/0",
          body: "Das aktuell ausgewählte Produkt ist einseitig, nur Schwarz. Oliv ist dort nicht möglich — das ist eine Produkteigenschaft, keine Gestaltungsfrage. Entweder die vierfarbige Variante bestellen, oder der Umschlag wird schwarz auf Weiss. Ein vollflächig oliv bedruckter Umschlag verlangt ausserdem stärkeres Papier als 80 g: dünnes Offsetpapier wellt sich unter Vollton.",
        },
        {
          title: "Die Anschrift steht genau einmal",
          body: "Der erste Entwurf trug sie im Eckblock und nochmal in der Zeile über dem Fenster — das las sich wie zwei Absender übereinander. Jetzt ist der Eckblock Marke plus Erreichbarkeit, und die postalische Anschrift steht dort, wo sie bei Fensterumschlägen hingehört: klein, über dem Fenster.",
        },
        {
          title: "Zwei Millimeter Luft um das Fenster",
          body: "Das Datenblatt räumt rund 1 mm Versatz bei der Fensterposition ein. Wer bis an die Fensterkante setzt, riskiert angeschnittene Buchstaben an einer Stelle, die jeder Empfänger als Erstes ansieht.",
        },
        {
          title: "Das Briefmarkenfeld bleibt leer",
          body: "Oben rechts, rund 45 × 28 mm. Dort klebt später die Marke oder der Frankiervermerk; Druck darunter macht beides unleserlich.",
        },
      ]}
      openPoints={[
        "ENTSCHEIDUNG VOR ALLEM ANDEREN: 4/0 statt 1/0 bestellen, sonst ist dieser Entwurf nicht druckbar. Mit der Farbe steigt auch der Preis, und vollflächig Oliv verlangt schwereres Papier als 80 g.",
        "Der Entwurf ist noch nicht besprochen. Ob der Umschlag überhaupt gebraucht wird und wofür, entscheidet der Betreiber — bisher ist er eine Möglichkeit, kein Auftrag.",
        "Auflage und ob mit oder ohne Fenster: die Fensterfassung lohnt nur, wenn Anschriften aus einem System gedruckt werden. Wer von Hand adressiert, fährt ohne Fenster besser.",
        "Prüfen, ob der Umschlag zum Papier der Postkarte passt — beides liegt beim Gast auf demselben Tisch.",
      ]}
      printerNote={PRINTER_NOTE}
      prices={{
        caption:
          "Stand 25. August 2026, netto — Achtung, Preise der 1/0-Variante (nur Schwarz). Der Entwurf in Oliv braucht 4/0 und kostet mehr.",
        rows: [
          { qty: 100, net: 28.75 },
          { qty: 250, net: 36.24 },
          { qty: 500, net: 46.48 },
          { qty: 750, net: 57.29 },
          { qty: 1000, net: 58.44, pick: true },
          { qty: 1500, net: 90.86 },
          { qty: 2000, net: 90.95 },
          { qty: 2500, net: 110.07 },
          { qty: 5000, net: 161.7 },
        ],
        note: "Zwei Fallen: 750 Stück kosten 57,29 €, 1.000 kosten 58,44 € — 250 Umschläge mehr für 1,15 €. Und 1.500 kosten 90,86 €, 2.000 kosten 90,95 € — 500 mehr für neun Cent. Die runde Zahl ist hier immer der bessere Kauf. 1.000 Stück zu 5,84 Cent sind der Punkt, an dem die Kurve flach wird; darüber lagert man Papier für Jahre.",
      }}
      downloads={[
        {
          href: "/assets/print/goldoni-briefumschlag-druckdaten.pdf",
          label: "goldoni-briefumschlag-druckdaten.pdf",
          hint: "eine Seite, 230 × 120 mm, ohne Hilfslinien — das, was die Druckerei bekommt",
        },
        {
          href: "/assets/print/goldoni-briefumschlag-entwurf.pdf",
          label: "goldoni-briefumschlag-entwurf.pdf",
          hint: "Kontrollbogen in echter Grösse, mit Fenster, Endformat und Sicherheitsabstand",
        },
        {
          href: "/assets/print/wmd-briefumschlag-datenblatt.pdf",
          label: "wmd-briefumschlag-datenblatt.pdf",
          hint: "Original der Druckerei — Masse und Fensterposition",
        },
        {
          href: "/assets/print/wmd-briefumschlag-vorlage.pdf",
          label: "wmd-briefumschlag-vorlage.pdf",
          hint: "Original der Druckerei — Gestaltungsvorlage",
        },

      ]}
    />
  );
}
