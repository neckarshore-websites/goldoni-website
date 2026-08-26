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
      intro="26 × 26 × 4 cm, aussen vierfarbig bedruckt. Der Deckel ist mit Abstand die grösste Markenfläche im ganzen Satz — grösser als Postkarte, Bierdeckel und Briefumschlag zusammen, und der Gast schaut ihn an, während er wartet."
      status="Entschieden: Aufteilung A, weisser Karton, 225–250 Stück — bereit für die Druckdaten"
      aspect={{ w: 1200, h: 2373 }}
      sides={[
        {
          label: "Deckel",
          caption: "gewählte Aufteilung: Espresso oben, Bestellweg auf Olive",
          node: <PizzakartonArtwork variant="espresso-oben" />,
        },
        {
          label: "Stanzvorlage der Druckerei",
          caption: "flach ausgelegt, 353 × 698 mm — noch ohne unsere Gestaltung",
          src: "/assets/print/pizzakarton-stanzvorlage.jpg",
          alt: "Flach ausgelegte Stanzvorlage eines Pizzakartons mit Deckel, Boden, drei Seitenlaschen und Falzlinien.",
        },
      ]}
      specs={[
        ["Innenmass", "26 × 26 × 4 cm"],
        ["Endformat flach", "343 × 688 mm"],
        ["Datenformat", "353 × 698 mm"],
        ["Beschnitt", "5 mm, im Datenformat enthalten"],
        ["Sicherheitsabstand", "3 mm ab Endformat"],
        ["Druck", "4/0 — nur aussen, vierfarbig"],
        ["Schrift positiv", "mindestens 10 pt (3,53 mm)"],
        ["Schrift negativ", "mindestens 12 pt (4,23 mm)"],
      ]}
      printerNote={`HINWEISE ZUR DATEI — Ristorante Goldoni, Pizzakarton 26 x 26 x 4 cm

Die Datei liegt in RGB vor. Bitte nach Ihrem Standardprofil nach CMYK
wandeln (ISO Coated v2 / FOGRA39 bzw. PSO Coated v3), relativ
farbmetrisch mit Tiefenkompensierung.

Bedruckt wird WELLPAPPE, weiss, ungestrichen und stark saugend — bitte
den Farbauftrag entsprechend Ihrer Erfahrung mit diesem Material
begrenzen. Die Deckelflaeche ist vollflaechig in zwei Toenen eingefaerbt;
dort faellt ein zu hoher Auftrag zuerst auf.

Fuer die drei folgenden Stellen bitten wir darum, die Zielwerte zu setzen
statt allein automatisch zu wandeln:

1. QR-CODE (Deckel, unteres Feld)
   Module: 100 % Schwarz, C 0 / M 0 / Y 0 / K 100.
   KEIN Vierfarbschwarz — an den Modulkanten kostet jede
   Passerdifferenz Lesbarkeit, und auf saugender Wellpappe laeuft die
   Farbe ohnehin.
   Ruhezone um den Code: Papierweiss, 0 / 0 / 0 / 0. Der Code steht
   bewusst auf einer weissen Kachel, nicht direkt auf der Farbflaeche.

2. VOLLTON OBEN (Espresso, RGB #1A1612)
   Zielwert: C 55 / M 60 / Y 60 / K 100 (warmes Tiefschwarz).
   Reines K 100 wirkt auf Wellpappe grau und fleckig.

3. VOLLTON UNTEN (Olive, RGB #746B03)
   Zielwert: C 20 / M 22 / Y 100 / K 40.

Weitere Farben, als Orientierung (aus der Datei umgerechnet):
   Mozzarella  #FAFAFA   C  1 / M  1 / Y  1 / K  0
   Parmigiano  #FEF1A5   C  0 / M  4 / Y 40 / K  0
   Tan         #C9BD8A   C 18 / M 18 / Y 48 / K  0

Datenformat 353 x 698 mm, Endformat 343 x 688 mm, 5 mm Beschnitt im
Datenformat enthalten. Druck 4/0, nur aussen, eine Seite.

BEDRUCKT IST NUR DIE DECKELFLAECHE. Sie liegt zwischen den Falzlinien
Ihrer Stanzvorlage bei 45,7 / 307,2 mm waagerecht und 42,4 / 302,4 mm
senkrecht; das Motiv steht dort um 180 Grad gedreht, passend zu der
kopfstehenden Beschriftung "DECKEL" auf Ihrer Vorlage. Boden, Rueckseite
und Seiten bleiben bewusst unbedruckt in der Materialfarbe weiss, ebenso
die grau markierten, nicht bedruckbaren Flaechen.

Schriften sind eingebettet, Text und QR-Code sind Vektor.
Saemtlicher Inhalt haelt mindestens 22 mm Abstand zu den Falzlinien.
Kleinste Schrift 7,4 mm (rund 21 pt) — deutlich ueber Ihrer Vorgabe von
10 pt positiv und 12 pt negativ.
Fertigungsbedingt liegt das Seitenformat rund 0,16 mm ueber dem
Sollmass; das liegt innerhalb des 5-mm-Beschnitts.`}
      decisions={[
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
          title: "Auf der Stanzvorlage positioniert, und um 180 Grad gedreht",
          body: "Die Deckelfläche liegt zwischen den Falzlinien bei 45,7 und 307,2 mm waagerecht und 42,4 und 302,4 mm senkrecht — 261,5 × 260,0 mm, ausgemessen an der Vorlage der Druckerei, nicht aus dem Datenblatt abgetippt. Das Motiv steht um 180 Grad gedreht auf dem Bogen: die Vorlage beschriftet die Fläche mit einem kopfstehenden „DECKEL“, und eine Panel-Beschriftung steht in der Leserichtung des fertigen Produkts. Ohne die Drehung stünde die Wortmarke auf dem geöffneten Karton verkehrt herum. Geprüft wird das nicht durch Nachdenken: „build.mjs --pruefen“ legt die Druckdaten deckungsgleich über die Stanzvorlage, und auf diesem Bild ist zu sehen, dass das Motiv in der Fläche liegt, die „DECKEL“ heisst.",
        },
        {
          title: "Der QR-Code gehört hierhin, nicht auf die Rückseite",
          body: "Wenn der Karton einen Bestellweg zeigt, dann auf dem Deckel: ein Gast, der die Schachtel gerade öffnet, hat die Hände am Karton und das Telefon daneben. Genau derselbe Code wie auf Postkarte und Bierdeckel.",
        },
      ]}
      openPoints={[
        "Farbmodus: die Datei ist RGB, die Druckerei fordert CMYK und wandelt laut eigenem Datenblatt automatisch. Auf Wellpappe, mit zwei Vollton-Feldern, ist das keine Kleinigkeit — vor der Auflage gehört ein Andruck bestellt.",
        "Beschaffung entschieden: selbst bestellen, 225 bis 250 Stück. Offen bleibt nur, ob die bisherigen Kartons vom Lieferanten weiterlaufen, solange der Vorrat reicht.",
      ]}
      prices={{
        caption:
          "Stand 25. August 2026, netto, aus dem Stückpreis der Druckerei hochgerechnet.",
        rows: [
          { qty: 50, net: 95.5 },
          { qty: 100, net: 96.0 },
          { qty: 200, net: 96.0 },
          { qty: 225, net: 96.75, pick: true },
          { qty: 250, net: 107.5 },
          { qty: 500, net: 215.0 },
          { qty: 1000, net: 420.0 },
          { qty: 1100, net: 451.0 },
        ],
        note: "Der Stückpreis fällt von 1,91 € bei 50 Stück auf 0,43 € und bleibt ab 225 praktisch stehen — 0,42 € ab 700, 0,41 € ab 1.100. Die Frage lautet deshalb nicht, wie billig es wird, sondern wie viele ins Lager passen: ab 225 Stück zahlt man für Menge, nicht mehr für einen besseren Preis. Zum Vergleich der Kleinmengen-Tarif für einen Testlauf: 20 Stück kosten 4,73 € je Karton, elfmal so viel wie bei 250.",
      }}
      downloads={[
        {
          href: "/assets/print/goldoni-pizzakarton-deckel-druckdaten.pdf",
          label: "goldoni-pizzakarton-deckel-druckdaten.pdf",
          hint: "Druckdaten, 353 × 698 mm — Motiv auf der Deckelfläche, RGB",
        },
        {
          href: "/assets/print/wmd-pizzakarton-datenblatt.pdf",
          label: "wmd-pizzakarton-datenblatt.pdf",
          hint: "Original der Druckerei — Masse, Flächen, Mindestschriftgrössen",
        },
        {
          href: "/assets/print/wmd-pizzakarton-vorlage.pdf",
          label: "wmd-pizzakarton-vorlage.pdf",
          hint: "Original der Druckerei — Stanzvorlage mit Falzlinien, 353 × 698 mm",
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
