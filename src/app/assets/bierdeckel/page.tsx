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
      intro="Liegt im Restaurant auf dem Tisch, unter dem Glas, und wird dort minutenlang angesehen. Trifft damit andere Gäste als die Postkarte: Leute, die gerade da sind und beim nächsten Mal vielleicht bestellen."
      status="Entwurf — Freigabe des Betreibers steht aus"
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
      printerNote={`HINWEISE ZUR DATEI — Ristorante Goldoni, Sechseck-Bierdeckel 93 x 81 mm

Die Datei liegt in RGB vor. Bitte nach Ihrem Standardprofil nach CMYK
wandeln (ISO Coated v2 / FOGRA39 bzw. PSO Coated v3), relativ
farbmetrisch mit Tiefenkompensierung.

Bierdeckelpappe ist ungestrichen und saugend — bitte den Farbauftrag
entsprechend Ihrer Erfahrung mit diesem Material begrenzen. Beide Seiten
sind vollflaechig eingefaerbt.

Fuer die zwei folgenden Stellen bitten wir darum, die Zielwerte zu setzen
statt allein automatisch zu wandeln:

1. QR-CODE (Rueckseite)
   Module: 100 % Schwarz, C 0 / M 0 / Y 0 / K 100.
   KEIN Vierfarbschwarz — an den Modulkanten kostet jede
   Passerdifferenz Lesbarkeit, und dieser Code ist der einzige Zweck
   der Rueckseite.
   Ruhezone um den Code: Papierweiss, 0 / 0 / 0 / 0.

2. VOLLTON-FLAECHEN
   Vorderseite Espresso (RGB #1A1612): C 55 / M 60 / Y 60 / K 100.
   Rueckseite Olive   (RGB #746B03): C 20 / M 22 / Y 100 / K 40.

Datenformat 99 x 87 mm, Seite 1 Vorderseite, Seite 2 Rueckseite.
Hintergruende laufen randlos bis an die Kante des Datenformats.
Keine Stanzkontur in der Datei — freie Stanzform nach Ihrer Vorlage.
Saemtlicher Inhalt liegt innerhalb des Sicherheitsabstands von 6 mm.
Fertigungsbedingt liegt das Seitenformat rund 0,14 mm ueber dem
Sollmass; das liegt innerhalb des 3-mm-Beschnitts.`}
      openPoints={[
        "Farbmodus: CMYK gefordert, unsere Datei ist RGB. Bierdeckelpappe ist ungestrichen und saugend — der Farbumschlag fällt hier stärker aus als auf gestrichenem Papier. Der Hinweistext oben setzt Zielwerte für die beiden Vollton-Flächen und den QR-Code.",
        "QR-Module in reinem Schwarz (nur K).",
        "Olive als Proof prüfen: vollflächig auf saugender Bierdeckelpappe fällt jeder Ton dunkler und stumpfer aus als auf gestrichenem Papier.",
        "Stanzkontur als eigene Ebene liefern, nicht als gedruckte Linie.",
        "Postkarte, Bierdeckel oder beides — und die Auflage.",
      ]}
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
