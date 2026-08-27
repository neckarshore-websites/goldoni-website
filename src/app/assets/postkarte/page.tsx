import type { Metadata } from "next";
import { PrintSpecPage } from "@/components/PrintSpecPage";

export const metadata: Metadata = {
  title: "Postkarte — Ristorante Goldoni (intern)",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PrintSpecPage
      navKey="postkarte"
      eyebrow="Drucksachen"
      title="Postkarte"
      intro="Liegt jeder Lieferung bei und im Restaurant aus. Sie hat eine Aufgabe: Gäste beim nächsten Mal direkt bei uns bestellen lassen statt über den Marktplatz."
      status="Entwurf A (Olive), Format A6 quer — Freigabe des Betreibers steht aus"
      aspect={{ w: 1600, h: 1154 }}
      sides={[
        {
          label: "Vorne",
          caption: "Einladung, Adresse, Telefon",
          src: "/assets/print/postkarte-vorderseite.jpg",
          alt: "Vorderseite der Postkarte auf dunklem Espresso-Grund mit der Zeile „Italienisch verliebt.“ und der Adresse.",
        },
        {
          label: "Hinten",
          caption: "QR-Code zur Bestellseite",
          src: "/assets/print/postkarte-rueckseite.jpg",
          alt: "Rückseite der Postkarte auf olivgrünem Grund mit „Direkt bei uns bestellen.“ und dem QR-Code.",
        },
      ]}
      specs={[
        ["Endformat", "148 × 105 mm (DIN A6 quer)"],
        ["Datenformat", "154 × 111 mm (Datenblatt bestätigt)"],
        ["Beschnitt", "3 mm umlaufend"],
        ["Sicherheitsabstand", "3 mm ab Endformat, allseitig"],
        ["Farbmodus", "CMYK gefordert — unsere Datei ist RGB"],
        ["Auflösung", "300 dpi gefordert; Text und QR sind Vektor"],
        ["Druck", "4/4-farbig"],
        ["QR gedruckt", "ca. 37 mm Kantenlänge"],
        ["Frühere Fassung", "A5 quer, 210 × 148 mm — verworfen 2026-08-25"],
      ]}
      decisions={[
        {
          title: "Keine Öffnungszeiten auf der Karte",
          body: "Papier lernt nicht nach. Zeiten ändern sich, gedruckte Karten liegen jahrelang herum.",
        },
        {
          title: "Nur der eigene Bestellweg",
          body: "Kein Uber Eats, kein zweiter Kanal — sonst arbeitet die Karte gegen ihren eigenen Zweck.",
        },
        {
          title: "Kein Papier-Gutschein",
          body: "Ein Gutschein, den man abgibt, vernichtet die Karte, die am Kühlschrank hängen bleiben soll. Aktionen laufen im Wolt-Portal.",
        },
        {
          title: "Kein Wort über Provisionen",
          body: "Abholung wird damit begründet, dass sie schnell ist — nicht damit, dass sie billiger ist.",
        },
        {
          title: "A6 statt A5, und neu gesetzt statt verkleinert",
          body: "Die Postkarte reist nach Hause; was mitreist, soll aufgehoben werden, und A6 ist das Format, das man behält. Die Schrift wurde dafür neu gesetzt — ein Verkleinern der A5-Werte hätte den Fliesstext auf 3,3 mm gedrückt. Der Bierdeckel übernimmt die andere Aufgabe: gesehen werden, im Lokal.",
        },
      ]}
      openPoints={[
        "Farbmodus: die Druckerei fordert CMYK, unsere Datei entsteht im Browser und ist RGB. Sie konvertiert automatisch — laut eigenem Datenblatt mit „leicht verändertem optischen Gesamteindruck“. Genau dort, wo die Karte vollflächig dunkel und vollflächig oliv ist, ist das keine Kleinigkeit. Entweder Proof bestellen oder die Datei ausserhalb des Browsers final setzen.",
        "QR-Module in reinem Schwarz (nur K) — aus einer RGB-Datei nicht zusicherbar, siehe Punkt darüber.",
        "Veredelung: Mattfolie braucht keine eigene Datei und ist damit sofort machbar. Partieller UV-, Glitzerlack und Heissfolie brauchen laut Datenblatt eine Sonderfarbebene (100 % Magenta, benannt „lack“ bzw. „praegung“, auf Überdrucken) — die kann unsere Browser-Strecke nicht erzeugen.",
        "Freigabe der Texte durch den Betreiber. Sie sprechen für sein Haus.",
        "Auflage.",
      ]}
      printerNote={`HINWEISE ZUR DATEI — Ristorante Goldoni, Postkarte A6 quer

Zwei Seiten, 154 x 111 mm Datenformat. Seite 1 Vorderseite, Seite 2 Rueckseite.
Schriften sind eingebettet, alle Inhalte sind Vektor.

Die Datei liegt in RGB vor; die Wandlung nach CMYK durch Sie ist uns bekannt
und recht.

EIN EINZIGER WUNSCH, und er betrifft nur den QR-Code auf der Rueckseite:
bitte dessen Module in reinem Schwarz halten (nur K), nicht in
Vierfarbschwarz. An den Modulkanten kostet jede Passerdifferenz Lesbarkeit.
Falls Ihr Ablauf das nicht getrennt steuern kann, sagen Sie uns bitte
Bescheid — wir liefern den Code dann als eigene Datei.

Fertigungsbedingt liegt das Seitenformat 0,18 mm ueber dem Sollmass. Bitte auf
148 x 105 mm mittig schneiden.`}
      prices={{
        caption:
          "Stand 25. August 2026, netto, ohne Veredelung. Mattfolie und die einmalige Qualitätskontrolle (14,00 € netto) kommen dazu.",
        rows: [
          { qty: 100, net: 17.74 },
          { qty: 250, net: 24.21 },
          { qty: 300, net: 26.57 },
          { qty: 500, net: 27.02, pick: true },
          { qty: 550, net: 41.61 },
        ],
        note: "500 ist die letzte Stufe vor dem Sprung: von 300 auf 500 kostet 45 Cent mehr — für 200 zusätzliche Karten. Die nächste Stufe darüber kostet 54 Prozent mehr für 10 Prozent mehr Karten. Alles zwischen 300 und 500 zu bestellen wäre unvernünftig.",
      }}
      downloads={[
        {
          href: "/assets/print/goldoni-postkarte-a6-druckdaten.pdf",
          label: "goldoni-postkarte-a6-druckdaten.pdf",
          hint: "zwei Seiten à 154 × 111 mm, ohne Marken — das, was die Druckerei bekommt. RGB, siehe offene Punkte",
        },
        {
          href: "/assets/print/goldoni-postkarte-a6.pdf",
          label: "goldoni-postkarte-a6.pdf",
          hint: "A6 quer, echte Grösse, mit Endformat-Marke",
        },
        {
          href: "/assets/print/goldoni-postkarte-entwuerfe.pdf",
          label: "goldoni-postkarte-entwuerfe.pdf",
          hint: "frühere A5-Fassung, beide Farbvarianten A und B",
        },
        {
          href: "/assets/print/wmd-postkarte-a6-datenblatt.pdf",
          label: "wmd-postkarte-a6-datenblatt.pdf",
          hint: "Original der Druckerei — Masse und Anforderungen an Veredelungen",
        },
        {
          href: "/assets/print/wmd-postkarte-a6-vorlage.pdf",
          label: "wmd-postkarte-a6-vorlage.pdf",
          hint: "Original der Druckerei — Gestaltungsvorlage",
        },
        {
          href: "/assets/print/postkarte-vorderseite.jpg",
          label: "postkarte-vorderseite.jpg",
          hint: "zum Weitergeben per Messenger",
        },
        {
          href: "/assets/print/postkarte-rueckseite.jpg",
          label: "postkarte-rueckseite.jpg",
          hint: "zum Weitergeben per Messenger",
        },
      ]}
    />
  );
}
