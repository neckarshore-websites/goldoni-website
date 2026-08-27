import type { Metadata } from "next";
import { PizzakartonArtwork } from "@/components/artwork/PrintArtwork";
import { PrintSpecPage } from "@/components/PrintSpecPage";

export const metadata: Metadata = {
  title: "Pizzakarton — Ristorante Goldoni (intern)",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PrintSpecPage
      navKey="pizzakarton"
      eyebrow="Drucksachen"
      title="Pizzakarton"
      intro="32 × 32 × 4 cm, aussen vierfarbig bedruckt. Der Deckel ist mit Abstand die grösste Markenfläche im ganzen Satz — grösser als Postkarte, Bierdeckel und Briefumschlag zusammen, und der Gast schaut ihn an, während er wartet."
      status="Druckdaten liegen vor. Entschieden: 32 × 32 cm, Aufteilung A, weisser Karton, 250 Stück — zuerst ein einzelner Probekarton"
      aspect={{ w: 1200, h: 2376 }}
      sides={[
        {
          label: "Deckel",
          caption: "gewählte Aufteilung: Espresso oben, Bestellweg auf Olive",
          node: <PizzakartonArtwork variant="espresso-oben" />,
        },
        {
          label: "Stanzvorlage der Druckerei",
          caption: "flach ausgelegt, 413 × 818 mm — noch ohne unsere Gestaltung",
          src: "/assets/print/pizzakarton-stanzvorlage.jpg",
          alt: "Flach ausgelegte Stanzvorlage eines Pizzakartons mit Deckel, Boden, drei Seitenlaschen und Falzlinien.",
        },
      ]}
      specs={[
        ["Innenmass", "32 × 32 × 4 cm"],
        ["Endformat flach", "403 × 808 mm"],
        ["Datenformat", "413 × 818 mm"],
        ["Beschnitt", "5 mm, im Datenformat enthalten"],
        ["Sicherheitsabstand", "3 mm ab Endformat"],
        ["Druck", "4/0 — nur aussen, vierfarbig"],
        ["Schrift positiv", "mindestens 10 pt (3,53 mm)"],
        ["Schrift negativ", "mindestens 12 pt (4,23 mm)"],
      ]}
      decisions={[
        {
          title: "32 × 32 statt 26 × 26 — die kleine Größe entfällt",
          body: "Betreiber-Entscheidung 2026-08-26. Diese Seite beschreibt ab sofort ausschliesslich den grossen Karton; der 26er wird nicht parallel geführt, weil eine Bestellgrundlage mit zwei Größen genau die Verwechslung erzeugt, die sie verhindern soll. Die Stanze ist baugleich: dieselben sechs Flächen, dieselben Laschen mit 40,5 mm, dieselben Regeln für Beschnitt, Sicherheitsabstand und Mindestschrift. Gewachsen ist nur das Quadrat — der Bogen wird um exakt die 60 mm breiter, die der Deckel breiter wird. Die Gestaltungsentscheidungen vom 25. August bleiben deshalb alle gültig, sie liegen nur auf einer grösseren Fläche. Der alte Stand ist über die Versionsgeschichte erreichbar.",
        },
        {
          title: "Die Deckelfläche wird gemessen, nicht gerechnet — und die gerechnete Zahl war falsch",
          body: "Für die Druckdaten liest ein eigenes Werkzeug die Fläche aus der Stanzvorlage der Druckerei: Falzlinien aus dem Rasterbild, das richtige Feld über die Beschriftung «DECKEL» aus der Textebene derselben Datei. Ergebnis: 321,5 × 322,7 mm, 45,8 mm von links und 42,0 mm von oben. Bis dahin stand im Entwurf eine Höhe von 327 mm, abgeleitet aus der Bänderfolge des Datenblatts unter der Annahme, der Deckel sei das erste grosse Feld. Die Vorlage misst dieses Feld mit 322,7 mm und beschriftet das zweite, 327 mm hohe, mit «BODEN» — die Ableitung lag 4,3 mm daneben. Auf einer Stanzvorlage ist das genug, um eine Kante zu verfehlen. Die Zahl steht jetzt nirgends mehr abgeschrieben: ändert die Druckerei ihre Vorlage, hält der Bau an, statt still ein anderes Motiv auszugeben.",
        },
        {
          title: "Zwei Felder statt einer Fläche",
          body: "Betreiber-Entscheidung 2026-08-25: der Deckel wird waagerecht geteilt, oben die eine Farbe, unten die andere. Die Kante liegt bei 52 statt 50 Prozent — das obere Feld trägt mehr Inhalt und wirkt bei exakter Hälfte gedrückt. Eine genaue Halbierung sieht auf Papier kleiner aus, als sie ist.",
        },
        {
          title: "Aufteilung A gewählt, B verworfen",
          body: "Betreiber-Entscheidung 2026-08-25 nach dem direkten Vergleich beider Fassungen. Espresso oben, weil die Wortmarke damit auf demselben Grund steht wie auf Postkarte und Bierdeckel — wer eines kennt, erkennt das andere. Der Preis dieser Wahl, offen benannt: der Bestellweg, der einzige Teil mit einer Aufgabe, sitzt unten. Variante B (Felder getauscht) bleibt in der Versionsgeschichte, falls die Entscheidung je zurückgedreht wird.",
        },
        {
          title: "Nur der Deckel zählt",
          body: "Die Vorlage hat sechs Flächen: Deckel, Boden, Rückseite und drei Seiten. Gesehen wird im gefalteten Zustand vor allem der Deckel und die Vorderkante. Alles andere ist entweder verdeckt oder liegt auf dem Tisch — Gestaltung dort kostet Farbe und bringt nichts.",
        },
        {
          title: "Weisser Karton, entschieden",
          body: "Betreiber-Entscheidung 2026-08-25. Unsere Palette setzt hellen Grund voraus: Espresso auf braunem Karton ist kein Espresso mehr, und Oliv wird schlammig. Brauner Karton wirkt handwerklicher und ist meist günstiger — der Preisunterschied ist billiger als eine Farbwelt, die an einer Stelle bricht. Die grau markierten, nicht bedruckbaren Flächen des Bogens bleiben damit weiss.",
        },
        {
          title: "Schrift mindestens 10 pt, negativ 12 pt",
          body: "Wellpappe saugt und läuft. Feine Schrift schliesst zu; deshalb schreibt die Druckerei Mindestgrössen vor. Das schliesst Kleingedrucktes auf dem Karton praktisch aus — auf dem Deckel gehört ohnehin wenig hin.",
        },
        {
          title: "Der QR-Code gehört hierhin, nicht auf die Rückseite",
          body: "Wenn der Karton einen Bestellweg zeigt, dann auf dem Deckel: ein Gast, der die Schachtel gerade öffnet, hat die Hände am Karton und das Telefon daneben. Genau derselbe Code wie auf Postkarte und Bierdeckel.",
        },
      ]}
      openPoints={[
        "Farbmodus: die Druckerei fordert CMYK, unsere Datei entsteht im Browser und ist RGB. Sie wandelt automatisch. Genau dort, wo der Deckel vollflächig Espresso und vollflächig Oliv ist, entscheidet diese Wandlung über den Eindruck — auf weisser Wellpappe, die stark saugt, stärker als auf gestrichenem Papier. Die Hinweise für die Druckerei weiter unten setzen deshalb Zielwerte für die beiden Vollton-Flächen, den QR-Code und die helle Schrift. Sie ersetzen keinen Andruck — dafür ist der Probekarton da.",
        "Die Vorschau oben zeigt den Deckel weiterhin 327 mm hoch, die Druckdaten 322,7 mm. Die Bildschirmfassung ist damit 1,3 Prozent zu hoch — physisch sind alle Schriftgrössen identisch, nur der Rahmen ist es nicht. Die Korrektur ist eine Zahl in einer Zeile, aber sie verschiebt die am 25. August abgenommene Aufteilung um 4,3 mm und braucht deshalb eine Entscheidung des Betreibers, keine stille Änderung.",
        "Ein einzelner Probekarton für 13,50 € netto wird zuerst bestellt (Betreiber-Entscheidung 2026-08-26). Er ist zugleich die Abnahme, die ein Bildschirm nicht leisten kann: Farbe auf Wellpappe, Lesbarkeit des Codes auf saugendem Material, Wirkung der Schriftgrössen in echter Grösse.",
        "Beschaffung entschieden: selbst bestellen, 250 Stück nach dem Probekarton. Offen bleibt nur, ob die bisherigen 26er-Kartons vom Lieferanten weiterlaufen, solange der Vorrat reicht.",
      ]}
      prices={{
        caption:
          "Stand 26. August 2026, netto, aus dem Stückpreis der Druckerei hochgerechnet.",
        rows: [
          { qty: 1, net: 13.5 },
          { qty: 50, net: 95.5 },
          { qty: 100, net: 96.0 },
          { qty: 200, net: 108.0 },
          { qty: 225, net: 117.0 },
          { qty: 250, net: 130.0, pick: true },
          { qty: 500, net: 260.0 },
          { qty: 1000, net: 510.0 },
          { qty: 1100, net: 550.0 },
        ],
        note: "Der Stückpreis fällt von 1,91 € bei 50 Stück auf 0,52 € und steht ab 225 still — 0,51 € erst ab 700, 0,50 € ab 1.100. Gewählt sind 250 Stück. Dass 225 denselben Stückpreis hat, ändert daran nichts: die 25 zusätzlichen Kartons kosten exakt den Stückpreis, weder Aufschlag noch Nachlass. Die erste Zeile ist kein Staffelpreis, sondern der Einzelpreis für einen Probekarton — 13,50 € netto vom Betreiber erfragt, nicht aus der Staffel gerechnet. Zur Einordnung: der kleine 26er lag bei 250 Stück bei 107,50 € netto, der grosse liegt bei 130,00 €.",
      }}
      printerNote={`HINWEISE ZUR DATEI — Ristorante Goldoni, Pizzakarton 32 x 32 x 4 cm

Eine Seite, 413 x 818 mm Datenformat. Schriften eingebettet, alles Vektor.

DREI DINGE SEHEN AUS WIE EIN FEHLER UND SIND ABSICHT:

1. Der Bogen ist fast vollstaendig unbedruckt. Bedruckt wird nur der DECKEL;
   alle anderen Flaechen sind im gefalteten Zustand verdeckt.
2. Das Motiv steht um 180 Grad gedreht. Ihre Vorlage beschriftet die
   Deckelflaeche kopfstehend — gedreht steht die Wortmarke auf dem geoeffneten
   Karton richtig.
3. Die Farbe endet an den Falzlinien und laeuft nicht darueber hinaus. Dort
   bricht die Kante beim Falten ohnehin.

Die bedruckte Flaeche ist an den Falzlinien Ihrer Stanzvorlage ausgemessen:
321,5 x 322,7 mm, 45,8 mm von links und 42,0 mm von oben.

Die Datei liegt in RGB vor; die Wandlung nach CMYK durch Sie ist uns bekannt
und recht.

WEISSE WELLPAPPE SAUGT STARK. Bitte den Gesamtfarbauftrag nach Ihrer Erfahrung
mit diesem Material begrenzen — wir geben bewusst keine Zahl vor. Wenn dabei
der Ton der beiden Vollton-Felder leidet, ist uns der niedrigere Auftrag lieber.

ZWEI WUENSCHE:
- Der QR-Code in reinem Schwarz (nur K), nicht in Vierfarbschwarz. Er misst
  86 mm und ist bewusst gross, weil das Material saugt.
- Die helle Schrift (Wortmarke und Bestellweg) bitte als Aussparung auf das
  Material setzen, nicht als feines Raster. Der Wert liegt knapp unter
  Papierweiss; ein 2-Prozent-Raster waere auf Wellpappe unsichtbar oder fleckig.

Kleinste Schrift 6,1 mm, rund 17 pt — deutlich ueber Ihrem Mindestmass.`}
      downloads={[
        {
          href: "/assets/print/goldoni-pizzakarton-deckel-druckdaten.pdf",
          label: "goldoni-pizzakarton-deckel-druckdaten.pdf",
          hint: "das, was an die Druckerei geht — Motiv auf der Deckelfläche der Vorlage, 413 × 818 mm",
        },
        {
          href: "/assets/print/wmd-pizzakarton-datenblatt.pdf",
          label: "wmd-pizzakarton-datenblatt.pdf",
          hint: "Original der Druckerei — Masse, Flächen, Mindestschriftgrössen",
        },
        {
          href: "/assets/print/wmd-pizzakarton-vorlage.pdf",
          label: "wmd-pizzakarton-vorlage.pdf",
          hint: "Original der Druckerei — Stanzvorlage mit Falzlinien, 413 × 818 mm",
        },
        {
          href: "/assets/print/pizzakarton-stanzvorlage.jpg",
          label: "pizzakarton-stanzvorlage.jpg",
          hint: "dieselbe Vorlage als Bild, zum Weitergeben",
        },
      ]}
    />
  );
}
