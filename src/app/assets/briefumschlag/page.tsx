import type { Metadata } from "next";
import {
  BriefumschlagArtwork,
  BriefumschlagBackArtwork,
} from "@/components/artwork/PrintArtwork";
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
      status="Bestellt: einseitig 1/0 schwarz-weiss — die Rückseite bleibt unbedruckt"
      aspect={{ w: 1600, h: 835 }}
      sides={[
        {
          label: "Vorderseite",
          caption: "zweifarbig geteilt, Fenster und Briefmarkenfeld bleiben frei",
          node: <BriefumschlagArtwork />,
        },
        {
          label: "Rückseite",
          caption: "trägt die Absenderanschrift",
          node: <BriefumschlagBackArtwork />,
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
        ["Druck", "1/0 — einseitig schwarz-weiss (bestelltes Produkt, Betreiber 2026-08-26)"],
      ]}
      decisions={[
        {
          title: "Dieselbe Sprache wie Postkarte und Bierdeckel",
          body: "Betreiber-Entscheidung 2026-08-25: Oliv und Espresso auf allen Drucksachen. Der Umschlag trägt deshalb dieselbe Wortmarke, dieselbe Fläche, dieselben Farben — er ist bei vielen Gästen der erste Kontakt mit dem Haus, oft bevor sie die Website kennen.",
        },
        {
          title: "Zwei Farben vorne, Anschrift hinten",
          body: "Betreiber-Entscheidung 2026-08-25. Die Vorderseite ist waagerecht geteilt: oben Espresso mit der Wortmarke, unten Olive mit dem Fenster. Die Absenderanschrift wandert auf die Rückseite und macht die Vorderseite ruhig.",
        },
        {
          title: "Die Kante liegt über dem Fenster, nicht in der Mitte",
          body: "Eine Teilung in der geometrischen Mitte sähe ausgewogener aus und liefe genau durch das Fenster — die Anschrift des Empfängers wäre dann von einer Farbkante durchschnitten. Deshalb sitzt die Kante knapp darüber, und das Fenster steht vollständig im olivgrünen Feld.",
        },
        {
          title: "Einseitig 1/0 — die frühere Notiz „vierfarbig beidseitig“ war falsch",
          body: "Betreiber-Korrektur 2026-08-26 gegen die eigene Notiz vom Vortag: bestellt ist „einseitig 1/0 schwarz-/weiss bedruckt“, die Rückseite bleibt unbedruckt weiss. Die Seite führte bis dahin 4/4 vierfarbig beidseitig, die Druckdaten hatten immer eine Seite in Schwarz — die Datei hatte also recht und die Beschreibung nicht. Festgehalten statt gelöscht, weil die Farbfrage bei einer Neuauflage wiederkommt: gegen Farbe sprach nie der Preis, sondern dass eine grosse Vollton-Fläche auf 80-g-Offsetpapier durchschlägt und den Umschlag wellig macht.",
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
        "Die Rückseite: das bestellte Produkt ist einseitig bedruckt, die Vorschau auf dieser Seite zeigt aber eine gestaltete Rückseite mit der Absenderanschrift. Eine der beiden muss weichen — entweder wandert der Absender auf die bedruckte Vorderseite, oder er entfällt. Betreiber-Entscheidung, keine Bauentscheidung.",
        "Beim Bestellen die 4/4-Variante wählen — die Staffel auf dieser Seite stammt aus einer beidseitigen Auswahl, deren Farbigkeit noch zu bestätigen ist. Weicht der Preis deutlich ab, sag Bescheid, dann rechne ich die Tabelle neu.",
        "Beidseitiger Vollton auf 80 g Offsetpapier wellt sich. Vor der Bestellung prüfen, ob ein schwereres Papier wählbar ist.",
        "Der Entwurf ist noch nicht besprochen. Ob der Umschlag überhaupt gebraucht wird und wofür, entscheidet der Betreiber — bisher ist er eine Möglichkeit, kein Auftrag.",
        "Auflage und ob mit oder ohne Fenster: die Fensterfassung lohnt nur, wenn Anschriften aus einem System gedruckt werden. Wer von Hand adressiert, fährt ohne Fenster besser.",
        "Prüfen, ob der Umschlag zum Papier der Postkarte passt — beides liegt beim Gast auf demselben Tisch.",
      ]}
      printerNote={PRINTER_NOTE}
      prices={{
        caption:
          "Stand 25. August 2026, netto. Betreiber-Korrektur: die Staffel gilt für den BEIDSEITIG bedruckten Umschlag — sie deckt den Entwurf mit Vorder- und Rückseite also bereits ab.",
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
