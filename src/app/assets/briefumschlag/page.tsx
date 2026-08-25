import type { Metadata } from "next";
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
      status="Erster Entwurf — noch nicht besprochen, noch nicht freigegeben"
      aspect={{ w: 1600, h: 835 }}
      sides={[
        {
          label: "Vorderseite",
          caption: "einseitig bedruckt, nur Schwarz",
          src: "/assets/print/briefumschlag-vorderseite.jpg",
          alt: "Briefumschlag DIN lang quer: Wortmarke Goldoni oben links, Absenderzeile über dem Sichtfenster, Briefmarkenfeld oben rechts.",
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
        ["Druck", "1/0 — einseitig, nur Schwarz"],
      ]}
      decisions={[
        {
          title: "Keine Vollton-Flächen",
          body: "Die Postkarte und der Bierdeckel leben von vollflächigem Espresso und Olive. Hier wäre dasselbe ein Fehler: 80-g-Offsetpapier schlägt bei grossen schwarzen Flächen durch, wellt sich, und das Produkt ist ohnehin einfarbig. Der Umschlag arbeitet mit Weissraum statt mit Fläche.",
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
        "Der Entwurf ist noch nicht besprochen. Ob der Umschlag überhaupt gebraucht wird und wofür, entscheidet der Betreiber — bisher ist er eine Möglichkeit, kein Auftrag.",
        "Auflage und ob mit oder ohne Fenster: die Fensterfassung lohnt nur, wenn Anschriften aus einem System gedruckt werden. Wer von Hand adressiert, fährt ohne Fenster besser.",
        "Prüfen, ob der Umschlag zum Papier der Postkarte passt — beides liegt beim Gast auf demselben Tisch.",
      ]}
      printerNote={PRINTER_NOTE}
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
        {
          href: "/assets/print/briefumschlag-vorderseite.jpg",
          label: "briefumschlag-vorderseite.jpg",
          hint: "zum Weitergeben per Messenger",
        },
      ]}
    />
  );
}
