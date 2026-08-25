import type { Metadata } from "next";
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
      status="Noch kein Entwurf — Masse ausgewertet, Stanzvorlage liegt vor"
      aspect={{ w: 1200, h: 2373 }}
      sides={[
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
      decisions={[
        {
          title: "Nur der Deckel zählt",
          body: "Die Vorlage hat sechs Flächen: Deckel, Boden, Rückseite und drei Seiten. Gesehen wird im gefalteten Zustand vor allem der Deckel und die Vorderkante. Alles andere ist entweder verdeckt oder liegt auf dem Tisch — Gestaltung dort kostet Farbe und bringt nichts.",
        },
        {
          title: "Grau markierte Flächen bleiben Materialfarbe",
          body: "Das Datenblatt weist Bereiche aus, die gar nicht bedruckt werden können. Sie behalten die Farbe des Kartons — weiss oder braun, das ist eine Bestellentscheidung und beeinflusst, wie unsere Farben wirken.",
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
        "Es gibt noch keinen Entwurf. Als Nächstes: Deckelgestaltung auf Basis der Stanzvorlage, mit dem QR-Code und einer sehr kurzen Zeile — mehr trägt Wellpappe nicht.",
        "Kartonfarbe entscheiden: weiss oder braun. Auf braunem Karton verschiebt sich jede Farbe, und Espresso auf Braun ist kein Espresso mehr.",
        "Auflage und Preis: ein Pizzakarton ist eine andere Grössenordnung als 500 Postkarten für 27 Euro. Vor der Gestaltung lohnt der Blick auf die Staffelpreise.",
        "Vor der Bestellung klären, ob die aktuellen Kartons vom Lieferanten kommen und ob eine eigene Bestellung überhaupt zum Bedarf passt.",
      ]}
      downloads={[
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
