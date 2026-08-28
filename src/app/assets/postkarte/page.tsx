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
      status="Entwurf A (Olive), A6 quer — Texte vom Betreiber freigegeben, bestellbereit: 500 Stück mit Mattfolie auf Seite 2"
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
        "Farbmodus, am 28.08.2026 gemessen statt geschätzt: die Datei ist RGB, die Druckerei wandelt automatisch. Eine Wandlung mit generischem Profil ergibt 220 % Farbauftrag auf der oliven und 284 % auf der schwarzen Fläche — beide unter der üblichen 300-%-Grenze, die frühere Sorge über die beiden Vollton-Flächen war also grösser als der Befund. Das Profil der Druckerei kennen wir weiterhin nicht; ohne Andruck bleibt die Farbe die eine ungeprüfte Grösse.",
        "QR-Module: dieselbe Messung zeigt C72 M68 Y67 K89, also ein Vierfarbschwarz. Entschieden am 28.08.2026, das so hinzunehmen und nicht darauf zu warten — der Hinweistext bittet weiter um reines K, hält den Auftrag aber ausdrücklich nicht auf. Bei sauberem Passer ist es folgenlos; bei Passerdifferenz fransen die Modulkanten aus.",
        "Weitere Veredelungen: partieller UV-, Glitzerlack und Heissfolie brauchen laut Datenblatt eine Sonderfarbebene (100 % Magenta, benannt „lack“ bzw. „praegung“, auf Überdrucken) — die kann unsere Browser-Strecke nicht erzeugen. Mattfolie braucht keine eigene Datei; sie ist bestellt und liegt auf Seite 2.",
        "Die einmalige Qualitätskontrolle der Druckerei (14,00 € netto) wird bewusst NICHT mitbestellt — Entscheidung vom 28.08.2026. Sie prüft Format, Schriften und Beschnitt, laut Datenblatt aber nicht die Farbe.",
      ]}
      printerNote={`HINWEISE ZUR DATEI — Ristorante Goldoni, Postkarte A6 quer

Zwei Seiten, 154 x 111 mm Datenformat.
Seite 1 = oliv, mit QR-Code — bitte unkaschiert lassen.
Seite 2 = schwarz, Einladung — bitte hier die Mattfolie.
Schriften sind eingebettet, alle Inhalte sind Vektor.

Die Datei liegt in RGB vor; die Wandlung nach CMYK durch Sie ist uns bekannt
und recht.

ZUM QR-CODE AUF SEITE 1, als Wunsch und nicht als Bedingung: wenn Ihr Ablauf
es ohne Rueckfrage hergibt, halten Sie dessen Module bitte in reinem Schwarz
(nur K) statt in Vierfarbschwarz — an den Modulkanten kostet jede
Passerdifferenz Lesbarkeit. Falls das bei Ihnen nicht getrennt steuerbar ist,
drucken Sie bitte wie ueblich. Der Auftrag soll daran nicht warten.

Fertigungsbedingt liegt das Seitenformat 0,18 mm ueber dem Sollmass. Bitte auf
148 x 105 mm mittig schneiden.`}
      prices={{
        caption:
          "Stand 25. August 2026, netto, ohne Veredelung; seither nicht nachgemessen. Die Mattfolie kommt dazu. Die einmalige Qualitätskontrolle (14,00 € netto) wird nicht mitbestellt.",
        rows: [
          { qty: 100, net: 17.74 },
          { qty: 250, net: 24.21 },
          { qty: 300, net: 26.57 },
          { qty: 500, net: 27.02, pick: true },
          { qty: 550, net: 41.61 },
        ],
        note: "500 ist die letzte Stufe vor dem Sprung: von 300 auf 500 kostet 45 Cent mehr — für 200 zusätzliche Karten. Die nächste Stufe darüber kostet 54 Prozent mehr für 10 Prozent mehr Karten. Alles zwischen 300 und 500 zu bestellen wäre unvernünftig.",
      }}
      downloadGroups={[
        {
          key: "auftrag",
          title: "Für den Druckauftrag",
          note: "Eine einzige Datei geht an die Druckerei. Alles darunter bleibt bei uns.",
        },
        {
          key: "haus",
          title: "Herleitung und Dokumentation",
          note: "Für uns — Nachvollziehbarkeit, Weitergabe, Originale der Druckerei. Nichts davon gehört an die Bestellung.",
        },
      ]}
      downloads={[
        {
          href: "/assets/print/goldoni-postkarte-a6-druckdaten.pdf",
          label: "goldoni-postkarte-a6-druckdaten.pdf",
          hint: "zwei Seiten à 154 × 111 mm, ohne Marken. Seite 1 oliv mit QR, Seite 2 schwarz — die Reihenfolge trägt die Veredelungsangabe im Hinweistext",
          group: "auftrag",
        },
        {
          href: "/assets/print/goldoni-postkarte-a6.pdf",
          label: "goldoni-postkarte-a6.pdf",
          hint: "A6 quer, echte Grösse, mit Endformat-Marke — zum Prüfen am Bildschirm, nicht für die Bestellung",
          group: "haus",
        },
        {
          href: "/assets/print/goldoni-postkarte-entwuerfe.pdf",
          label: "goldoni-postkarte-entwuerfe.pdf",
          hint: "frühere A5-Fassung, beide Farbvarianten A und B — verworfen, nur noch Herleitung",
          group: "haus",
        },
        {
          href: "/assets/print/wmd-postkarte-a6-datenblatt.pdf",
          label: "wmd-postkarte-a6-datenblatt.pdf",
          hint: "Original der Druckerei — Masse und Anforderungen an Veredelungen",
          group: "haus",
        },
        {
          href: "/assets/print/wmd-postkarte-a6-vorlage.pdf",
          label: "wmd-postkarte-a6-vorlage.pdf",
          hint: "Original der Druckerei — Gestaltungsvorlage",
          group: "haus",
        },
        {
          href: "/assets/print/postkarte-vorderseite.jpg",
          label: "postkarte-vorderseite.jpg",
          hint: "zum Weitergeben per Messenger",
          group: "haus",
        },
        {
          href: "/assets/print/postkarte-rueckseite.jpg",
          label: "postkarte-rueckseite.jpg",
          hint: "zum Weitergeben per Messenger",
          group: "haus",
        },
      ]}
    />
  );
}
