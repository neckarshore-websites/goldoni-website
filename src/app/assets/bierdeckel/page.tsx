import type { Metadata } from "next";
import { PrintSpecPage } from "@/components/PrintSpecPage";

export const metadata: Metadata = {
  title: "Bierdeckel — Ristorante Goldoni (intern)",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PrintSpecPage
      navKey="bierdeckel"
      eyebrow="Drucksachen"
      title="Bierdeckel"
      intro="Soll im Restaurant auf dem Tisch liegen, unter dem Glas, und dort minutenlang angesehen werden — er würde damit andere Gäste treffen als die Postkarte: Leute, die gerade da sind und beim nächsten Mal vielleicht bestellen. Im Konjunktiv, und das ist keine Vorsicht: Goldoni verwendet heute keine Bierdeckel. Ob dieser einen Platz auf den Tischen bekommt, ist die eigentliche offene Frage dieser Seite — nicht die Auflage."
      status="Sechseck 93 × 81 mm — Texte vom Betreiber freigegeben (28.08.2026). Als Testballon bestellbereit: 25 Stück für 15,00 €, um ihn einmal in der Hand und auf dem Tisch zu sehen"
      aspect={{ w: 1200, h: 1048 }}
      sides={[
        {
          label: "Vorne",
          caption: "Wortmarke und der Satz von der Startseite",
          src: "/assets/print/bierdeckel-vorderseite.jpg",
          alt: "Sechseckiger Bierdeckel, Vorderseite auf dunklem Espresso-Grund mit der Wortmarke Goldoni.",
        },
        {
          label: "Hinten",
          caption: "QR-Code zur Bestellseite",
          src: "/assets/print/bierdeckel-rueckseite.jpg",
          alt: "Sechseckiger Bierdeckel, Rückseite auf olivgrünem Grund mit „Direkt bei uns bestellen.“ und dem QR-Code.",
        },
      ]}
      specs={[
        ["Endformat", "Sechseck, maximale Bemassung 93 × 81 mm"],
        ["Datenformat", "99 × 87 mm (Vorlage nachgemessen: 280,63 × 246,614 pt)"],
        ["Beschnitt", "3 mm, im Datenformat enthalten"],
        ["Sicherheitsabstand", "6 mm — ab Datenformat, nicht ab Stanzkante"],
        ["Stanzform", "frei, kommt vom Werkzeug — nicht in die Datei zeichnen"],
        ["Material", "1,5 mm Bierdeckelpappe, kompostierbar"],
        ["Druck", "4/4-farbig"],
        ["Farbmodus", "CMYK gefordert — unsere Datei ist RGB"],
        ["QR gedruckt", "ca. 33 mm Kantenlänge"],
      ]}
      decisions={[
        {
          title: "Die Druckdatei zeichnet kein Sechseck",
          body: "Der Kontrollbogen zeigt die Form, damit ein Mensch sie beurteilen kann. Die Druckdatei darf sie nicht zeichnen: der Hintergrund läuft randlos über das volle Datenformat, damit nach dem Stanzen keine weisse Kante stehenbleibt. Die Form macht das Werkzeug — „freie Stanzform“ nennt das Datenblatt es.",
        },
        {
          title: "Sechs Millimeter Sicherheitsabstand, ab Datenformat",
          body: "Das ist der Unterschied zur Postkarte, wo drei Millimeter ab Endformat gelten. Hier sind es sechs, und sie werden vom grösseren Mass aus gemessen — nutzbar bleibt entsprechend weniger. Alles Wichtige liegt deshalb in 58 Prozent der Breite, was zusätzlich die vier abgeschrägten Ecken berücksichtigt.",
        },
        {
          title: "Keine Adresse",
          body: "Wer den Deckel in der Hand hat, sitzt im Lokal. Wer ihn mitnimmt, findet den Weg zurück über den QR-Code. Bewusst so, nicht vergessen.",
        },
        {
          title: "Fehlerkorrektur H beim QR-Code",
          body: "Ein Bierdeckel bekommt Flecken. Die höchste Fehlerkorrektur-Stufe verträgt sie.",
        },
      ]}
      printerNote={`HINWEISE ZUR DATEI — Ristorante Goldoni, Sechseck-Bierdeckel

Zwei Seiten, 99 x 87 mm Datenformat. Seite 1 Vorderseite, Seite 2 Rueckseite.
Beide Seiten sind vollflaechig eingefaerbt, Hintergruende laufen randlos bis an
die Kante des Datenformats. Schriften eingebettet, alles Vektor.

Die Datei liegt in RGB vor; die Wandlung nach CMYK durch Sie ist uns bekannt
und recht.

BIERDECKELPAPPE IST UNGESTRICHEN UND SAUGEND. Bitte den Gesamtfarbauftrag nach
Ihrer Erfahrung mit diesem Material begrenzen — wir geben bewusst keine Zahl
vor, Sie kennen das Material besser als wir. Wenn dabei der Ton der beiden
Vollton-Flaechen leidet, ist uns der niedrigere Auftrag lieber.

EIN EINZIGER WUNSCH: den QR-Code auf der Rueckseite in reinem Schwarz halten
(nur K), nicht in Vierfarbschwarz. Er ist der ganze Zweck dieser Seite, und an
den Modulkanten kostet jede Passerdifferenz Lesbarkeit.

Keine Stanzkontur in der Datei — freie Stanzform nach Ihrer Vorlage.
Saemtlicher Inhalt liegt innerhalb des Sicherheitsabstands von 6 mm.`}
      openPoints={[
        "Farbmodus: CMYK gefordert, unsere Datei ist RGB. Bierdeckelpappe ist ungestrichen und saugend — der Farbumschlag fällt hier stärker aus als auf gestrichenem Papier. Der Hinweistext oben setzt Zielwerte für die beiden Vollton-Flächen und den QR-Code.",
        "QR-Module in reinem Schwarz (nur K).",
        "Olive als Proof prüfen: vollflächig auf saugender Bierdeckelpappe fällt jeder Ton dunkler und stumpfer aus als auf gestrichenem Papier.",
        "Stanzkontur als eigene Ebene liefern, nicht als gedruckte Linie.",
        "Der eigentliche offene Punkt ist nicht die Auflage, sondern die Platzierung: Goldoni verwendet heute keine Bierdeckel. Der Testballon beantwortet zwei Fragen auf einmal — wie Oliv auf saugender Pappe wirklich aussieht, und ob das Stück auf einem gedeckten Tisch überhaupt funktioniert. Erst danach ist eine Auflage sinnvoll.",
        "Auflage entschieden am 28.08.2026: 25 Stück für 15,00 € als Test. Bewusst gegen die wirtschaftlichere Stufe — 100 kosten 24,94 € und damit 24,9 statt 60 ct pro Stück, aber 75 davon läge niemand aus, solange die Platzierung nicht entschieden ist. Bei einem Testballon zählt der Gesamtbetrag, nicht der Stückpreis.",
      ]}
      prices={{
        caption:
          "Netto. Die Stufen ab 100 mit Stand 25. August 2026; die 25er-Stufe am 28. August im Shop nachgesehen. Ein Bierdeckel wird verbraucht, nicht aufgehoben — sobald er tatsächlich auf den Tischen liegt, entscheidet die Auflage, wie lange nicht nachbestellt werden muss.",
        rows: [
          { qty: 25, net: 15.0, pick: true },
          { qty: 100, net: 24.94 },
          { qty: 250, net: 54.47 },
          { qty: 500, net: 90.56 },
          { qty: 1000, net: 175.88 },
          { qty: 2500, net: 256.68 },
          { qty: 5000, net: 389.98 },
          { qty: 7500, net: 641.68 },
          { qty: 10000, net: 642.32 },
        ],
        note: "Gewählt sind 25 Stück für 15,00 €, und das ist bewusst die unwirtschaftlichste Zeile der Tabelle: 60 Cent pro Stück gegenüber 24,9 Cent bei 100. Der Grund steht in den offenen Punkten — solange nicht entschieden ist, ob der Deckel überhaupt auf die Tische kommt, ist jede grössere Menge Vorrat für eine Verwendung, die es noch nicht gibt. Wenn er sich bewährt, ist 500 für 90,56 € der vernünftige erste echte Lauf. Zwei Fallen weiter oben in der Staffel, für später: 7.500 Stück kosten 641,68 €, 10.000 kosten 642,32 € — 2.500 Deckel mehr für 64 Cent, und wer 7.500 bestellt, zahlt pro Stück mehr als bei 5.000.",
      }}
      downloads={[
        {
          href: "/assets/print/goldoni-bierdeckel-druckdaten.pdf",
          label: "goldoni-bierdeckel-druckdaten.pdf",
          hint: "zwei Seiten à 99 × 87 mm, randlos, ohne Stanzkontur — das, was die Druckerei bekommt",
        },
        {
          href: "/assets/print/goldoni-bierdeckel-entwurf.pdf",
          label: "goldoni-bierdeckel-entwurf.pdf",
          hint: "Kontrollbogen, beide Seiten in echter Grösse mit Stanzkontur zum Ausschneiden",
        },
        {
          href: "/assets/print/wmd-bierdeckel-datenblatt.pdf",
          label: "wmd-bierdeckel-datenblatt.pdf",
          hint: "Original der Druckerei — Masse, Sicherheitsabstand, Anforderungen",
        },
        {
          href: "/assets/print/wmd-bierdeckel-vorlage.pdf",
          label: "wmd-bierdeckel-vorlage.pdf",
          hint: "Original der Druckerei — Gestaltungsvorlage mit Stanzkontur (12 MB)",
        },
        {
          href: "/assets/print/bierdeckel-vorderseite.jpg",
          label: "bierdeckel-vorderseite.jpg",
          hint: "zum Weitergeben per Messenger",
        },
        {
          href: "/assets/print/bierdeckel-rueckseite.jpg",
          label: "bierdeckel-rueckseite.jpg",
          hint: "zum Weitergeben per Messenger",
        },
      ]}
    />
  );
}
