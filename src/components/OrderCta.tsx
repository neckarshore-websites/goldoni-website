import { STOREFRONT_PARTNER } from "@/lib/site";

/**
 * Bestell-CTA für die Kartenseiten (/menu, /empfehlungen).
 *
 * WARUM ES DIESE KOMPONENTE GIBT: Wer die Speisekarte liest, ist der Gast mit
 * der höchsten Bestellabsicht auf der ganzen Website — er schaut sich gerade
 * an, was es zu essen gibt. Bis heute führte von dort genau EIN Bestell-Link
 * weg, und der stand in der Fussleiste, hinter zehn Kategorien. Diese
 * Komponente verteilt den Weg über die Seite, statt ihn ans Ende zu legen.
 *
 * NUR DESKTOP (ab `md`, 768 px). Betreiber-Entscheidung 2026-08-25: die
 * Desktop-Fassung wird direkt umgesetzt, die Handy-Fassung wird getrennt
 * beurteilt und vorher als A/B-Prototyp auf /sandbox gebaut. Der Grund ist
 * kein Geschmack, sondern Platz: auf dem Handy klebt bereits ein zweizeiliger
 * Kopf plus die Kategorie-Pillenleiste am oberen Rand.
 *
 * `hidden md:*` ist deshalb LOAD-BEARING und nicht kosmetisch. Der Prototyp
 * deckt exakt das Komplement ab (< 768 px); ein Verschieben dieser Grenze auf
 * einer Seite ohne die andere erzeugt ein Band, in dem beides oder nichts
 * erscheint. Der E2E-Test prüft beide Seiten der Grenze.
 *
 * ZIEL-URL KOMMT AUS `STOREFRONT_PARTNER`, nie als Zeichenkette. Knopf,
 * gedruckter QR-Code, E-Mail-Signaturen und das JSON-LD hängen an derselben
 * Konstante. Eine neue Komponente ist genau die Stelle, an der sich sonst eine
 * Kopie einschleicht.
 *
 * BEWUSST NICHT MIT DeliveryBanner ZUSAMMENGELEGT: das Startseiten-Banner
 * trägt eine andere Aufgabe (Kanal-Hierarchie mit Marktplatz-Kacheln, eigener
 * Randbereich). Geteilt werden die Design-Tokens und die Datenquelle, nicht
 * das Layout — die Startseite bleibt von dieser Datei unberührt.
 */

/** Untertitel im Knopf. Wortgleich mit der Startseite, damit es derselbe Knopf ist. */
const SUBLINE = "Alles direkt aus der Küche";

/**
 * KEIN `display` in der Basisklasse — der Aufrufer setzt es. Sonst stünden
 * `hidden` und `inline-flex` gleichzeitig auf demselben Element und welches
 * gewinnt, entschiede die Reihenfolge im erzeugten Stylesheet statt wir.
 *
 * `rel="noopener"` OHNE `noreferrer` — dieselbe Begründung wie im
 * Startseiten-Banner: der fehlende Referrer würde die Bestellung als
 * Direktverkehr ankommen lassen, und genau die Zurechnung ist der Grund,
 * warum es diesen Kanal gibt. Datenschutz deckt die seitenweite
 * `Referrer-Policy: strict-origin-when-cross-origin` (nur Herkunft, nie Pfad).
 */
function StorefrontButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={STOREFRONT_PARTNER.url}
      target="_blank"
      rel="noopener"
      data-testid="order-cta"
      className={`flex-col rounded-xl px-7 py-4 text-left shadow-sm transition-transform hover:scale-[1.02] focus-visible:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`}
      style={{
        backgroundColor: "var(--color-accent)",
        outlineColor: "var(--color-accent)",
      }}
    >
      <span
        className="text-lg font-semibold leading-tight sm:text-xl"
        style={{ color: "var(--color-on-marinara)" }}
      >
        {STOREFRONT_PARTNER.tagline}
      </span>
      <span
        className="mt-0.5 text-xs font-medium uppercase tracking-wide sm:text-sm"
        style={{ color: "var(--color-on-marinara-muted)" }}
      >
        {SUBLINE}
      </span>
    </a>
  );
}

/**
 * Kopfzeilen-Variante — steht neben der Überschrift der Seite.
 *
 * Erwartet, dass die Überschrift links daneben liegt; der Aufrufer setzt die
 * Zeile, diese Komponente bringt nur sich selbst mit.
 */
export function OrderCtaHeadline() {
  return <StorefrontButton className="hidden md:inline-flex" />;
}

/**
 * Streifen-Variante — sitzt zwischen zwei Kategorien der Karte.
 *
 * Sie unterbricht die Karte bewusst nur einmal je Seitenhälfte. Ein Streifen
 * nach jeder Kategorie wäre kein Angebot mehr, sondern eine Litanei.
 */
export function OrderCtaBand({ text }: { text: string }) {
  return (
    <section
      aria-label="Direkt bestellen"
      className="hidden items-center justify-between gap-6 rounded-lg border px-6 py-5 md:flex"
      style={{
        backgroundColor: "var(--color-brand-cream)",
        borderColor: "var(--color-border)",
      }}
    >
      <p className="text-base" style={{ color: "var(--color-text)" }}>
        <span className="mr-2" aria-hidden style={{ color: "var(--color-accent)" }}>
          &#9679;
        </span>
        {text}
      </p>
      <StorefrontButton className="inline-flex flex-shrink-0" />
    </section>
  );
}
