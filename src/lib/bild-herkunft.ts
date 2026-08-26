/**
 * Register der Bild-Herkunft auf den öffentlichen Seiten.
 *
 * ANLASS: seit dem 2. August 2026 gelten die Transparenzpflichten der
 * KI-Verordnung (Artikel 50). Eine pauschale Kennzeichnungspflicht für alle
 * KI-Bilder gibt es nicht — die Pflicht greift bei Inhalten, die Reales
 * täuschend echt darstellen. Ob unsere Bilder darunterfallen, ist eine
 * juristische Bewertung und steht ausdrücklich NICHT hier: sie ist als
 * Auftrag an den DPO vorgemerkt. Dieses Register liefert die Tatsachen dafür.
 *
 * WARUM DAS HIER LIEGT UND NICHT IM BAUSTEIN: die Liste war eine Momentaufnahme
 * vom 25.08.2026, von Hand gepflegt, in einer .tsx-Datei. Ein neues Bild auf
 * einer Seite hätte sie still veralten lassen und nichts wäre rot geworden.
 * Als eigenes Datenmodul kann `tests/delivery/bild-herkunft.test.ts` sie lesen
 * und gegen die tatsächlichen Bildreferenzen im Quelltext halten — in BEIDE
 * Richtungen. Der Baustein zeigt dieselben Daten an, er hält sie nicht mehr.
 *
 * DER GELTUNGSBEREICH IST BEWUSST ENG: alle Bildreferenzen in `src/`, OHNE
 * `/assets` und `/sandbox`. Beide Seiten reden ÜBER Bilder, statt sie als
 * Inhalt zu zeigen — `hero-feiern-essen.webp` etwa liegt im Verzeichnis und
 * wird nur auf `/assets` aufgezählt. Ein Tor über `public/images/*.webp` würde
 * genau diese Datei fälschlich einfordern und damit eine andere Menge messen
 * als die, über die das Register eine Aussage macht.
 */

export type Herkunft = "ki" | "foto" | "offen";

/**
 * Der Nachweis zu einer Zeile. ALLE Felder sind optional, weil niemand alles
 * weiß — aber ein vorhandener Nachweis muss mindestens ein ausgefülltes Feld
 * haben. Ein leerer Nachweis wäre ein Platzhalter, der wie eine Angabe
 * aussieht, und das ist schlechter als die offene Lücke: die Frage, die hier
 * beantwortet werden soll, lautet gerade, welche Bilder KI-erzeugt sind.
 */
export type Nachweis = {
  /** Womit erzeugt (KI-Werkzeug samt Version) bzw. womit fotografiert. */
  werkzeug?: string;
  /** Wortlaut des Prompts, wenn KI-erzeugt. Gekürzt ist besser als geraten. */
  prompt?: string;
  /** Wann erzeugt oder aufgenommen, so genau wie bekannt (ISO oder "08/2026"). */
  erzeugt?: string;
  /** Wer die Rechte hält — Fotograf, Agentur, wir selbst. */
  rechte?: string;
  /** Alles, was sonst zur Einordnung hilft. */
  notiz?: string;
};

export type Zeile = {
  datei: string;
  seite: string;
  herkunft: Herkunft;
  /** Fehlt genau dann, wenn `herkunft === "offen"`. Vom Tor erzwungen. */
  nachweis?: Nachweis;
};

/**
 * Die fünf `offen`-Zeilen sind der eigentliche Fund. Sie sind NICHT
 * "vermutlich KI" — sie sind undokumentiert, und dazu gehört ausgerechnet
 * die Startseiten-Bildfolge und das Vorschaubild, das beim Teilen der Seite
 * erscheint. Ein Rateergebnis hier einzutragen wäre schlimmer als die Lücke.
 *
 * SO WIRD EINE OFFENE ZEILE GESCHLOSSEN: `herkunft` auf "ki" oder "foto"
 * setzen UND einen `nachweis` mit mindestens einem Feld ergänzen. Beides
 * zusammen, sonst hält das Tor an — eine Einordnung ohne Beleg ist eine
 * Behauptung, und Behauptungen sind hier der Fehlerfall.
 */
export const ZEILEN: Zeile[] = [
  { datei: "feiern-kandelaber-rosen-lilien.webp", seite: "Feste feiern (Galerie)", herkunft: "foto" },
  { datei: "feiern-saal-bogenfenster-tafel.webp", seite: "Feste feiern (Galerie)", herkunft: "foto" },
  { datei: "feiern-saal-historische-banner.webp", seite: "Feste feiern (Galerie)", herkunft: "foto" },
  { datei: "feiern-tafel-aus-naehe.webp", seite: "Feste feiern (Galerie)", herkunft: "foto" },
  { datei: "hero-empfehlungen-overhead-tafel.webp", seite: "Empfehlungskarte", herkunft: "ki" },
  { datei: "hero-feiern-saal.webp", seite: "Feste feiern (Hero)", herkunft: "foto" },
  { datei: "hero-goldoni-angel.webp", seite: "Startseite (Bildfolge)", herkunft: "offen" },
  { datei: "hero-goldoni-interior.webp", seite: "Startseite (Bildfolge) + Über uns + strukturierte Daten", herkunft: "offen" },
  { datei: "hero-goldoni-velvet.webp", seite: "Startseite (Bildfolge) + Vorschaubild beim Teilen", herkunft: "offen" },
  { datei: "hero-impressum-trauben.webp", seite: "Impressum", herkunft: "offen" },
  { datei: "hero-kontakt-pizzo.webp", seite: "Kontakt", herkunft: "offen" },
  { datei: "hero-menu-dishes.webp", seite: "Speisekarte + strukturierte Daten", herkunft: "ki" },
];

/** Verzeichnisse unter `src/`, die ÜBER Bilder reden statt sie zu zeigen. */
export const AUSSERHALB = ["src/app/assets/", "src/app/sandbox/"];

/**
 * Bilder, die KEINE Inhaltsdarstellung sind und deshalb nicht ins Register
 * gehören. Die Frage, für die das Register existiert, lautet: stellt dieses
 * Bild etwas Reales dar, und wenn ja, wurde es erzeugt oder aufgenommen? Für
 * eine Wort-Bild-Marke und einen maschinenlesbaren Code stellt sie sich nicht.
 *
 * Diese Liste ist absichtlich EXPLIZIT und trägt je einen Grund, statt den
 * Scanner still auf `.webp` zu verengen. Eine Formatfilterung würde heute
 * dasselbe leisten und morgen ein PNG-Inhaltsbild lautlos durchlassen — sie
 * wäre ein Zufall, der funktioniert, keine Entscheidung, die man nachlesen kann.
 */
export const NICHT_INHALT: Record<string, string> = {
  "wolt-logo.png": "Wort-Bild-Marke des Lieferpartners, keine Darstellung",
  "uber-eats-logo.png": "Wort-Bild-Marke des Lieferpartners, keine Darstellung",
  "storefront-qr-mail.png": "maschinenlesbarer Code, aus der Bestelladresse erzeugt",
};

/** Der Baustein, der das Register anzeigt — er ist selbst keine Bildreferenz. */
export const REGISTER_DATEIEN = [
  "src/lib/bild-herkunft.ts",
  "src/components/BildHerkunftInventur.tsx",
];

export function istBelegt(n: Nachweis | undefined): boolean {
  if (!n) return false;
  return Object.values(n).some((v) => typeof v === "string" && v.trim().length > 0);
}
