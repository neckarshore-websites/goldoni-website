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
        ["Endformat", "Sechseck, 93 × 81 mm"],
        ["Exakte Höhe", "80,54 mm (93 × √3⁄2)"],
        ["Datenformat", "100 × 87 mm"],
        ["Beschnitt", "3 mm umlaufend"],
        ["Material", "1,5 mm Bierdeckelpappe, kompostierbar"],
        ["Druck", "4/4-farbig"],
        ["QR gedruckt", "ca. 33 mm Kantenlänge"],
      ]}
      decisions={[
        {
          title: "Die 81 mm sind gerundet — die Datei rechnet mit 80,54",
          body: "Ein regelmässiges Sechseck mit 93 mm von Spitze zu Spitze ist 80,54 mm hoch. Wer glatte 81,0 einsetzt, staucht es um einen halben Millimeter, und die Stanze passt nicht mehr zur Datei.",
        },
        {
          title: "Alles Wichtige liegt in 60 Prozent der Breite",
          body: "Ein Sechseck verliert an vier Ecken Fläche, und Stanzen laufen um ein bis zwei Millimeter. Text, der die Schrägen ausreizt, ist der Text, der abgeschnitten wird.",
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
      openPoints={[
        "QR-Module in reinem Schwarz (nur K).",
        "Olive als Proof prüfen: vollflächig auf saugender Bierdeckelpappe fällt jeder Ton dunkler und stumpfer aus als auf gestrichenem Papier.",
        "Stanzkontur als eigene Ebene liefern, nicht als gedruckte Linie.",
        "Postkarte, Bierdeckel oder beides — und die Auflage.",
      ]}
      downloads={[
        {
          href: "/assets/print/goldoni-bierdeckel-entwurf.pdf",
          label: "goldoni-bierdeckel-entwurf.pdf",
          hint: "Kontrollbogen, beide Seiten in echter Grösse mit Stanzkontur",
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
