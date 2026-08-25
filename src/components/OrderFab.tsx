import { STOREFRONT_PARTNER } from "@/lib/site";

/**
 * Schwebender Bestell-Knopf — Variante B der Handy-Beurteilung (2026-08-25).
 *
 * Sitzt fest am unteren Rand, rechts, und bleibt beim Blättern stehen. Er
 * kostet keine Höhe am oberen Rand — dafür überlagert er die Karte, und zwar
 * dauerhaft. Das ist der Handel, über den entschieden wird.
 *
 * `visibility` entscheidet, auf welcher Seite der 768-px-Grenze er erscheint.
 * Die Live-Kartenseiten stehen seit dem 25.08. auf `always`: erst nur Desktop
 * (Variante C — schwebender Knopf statt Kopfknopf und Streifen), am selben
 * Tag auf das Handy erweitert (Variante B des A/B-Vergleichs).
 *
 * Die beiden Geräte tragen dabei verschiedene Rechnungen: am Desktop ist die
 * Karte eine zentrierte Spalte, die untere rechte Ecke bleibt leer und der
 * Knopf kostet nichts. Am Handy füllt dieselbe Spalte den Bildschirm — dort
 * verdeckt er zwangsläufig eine Zeile. Betreiber-Entscheidung: der Handel
 * lohnt sich, weil der Bestellweg sonst am Ende der Karte begraben liegt.
 *
 * `mobile` und `desktop` bleiben als Werte erhalten; die Prototypseiten unter
 * /sandbox nutzen sie für den Vergleich.
 *
 * `bottom` respektiert `env(safe-area-inset-bottom)`, damit der Knopf auf
 * iPhones nicht unter der Home-Leiste klebt.
 */
export function OrderFab({
  visibility = "mobile",
}: {
  visibility?: "mobile" | "desktop" | "always";
} = {}) {
  const breakpointClass =
    visibility === "mobile"
      ? "md:hidden"
      : visibility === "desktop"
        ? "hidden md:flex"
        : "";

  return (
    <a
      href={STOREFRONT_PARTNER.url}
      target="_blank"
      rel="noopener"
      data-testid="order-cta-fab"
      className={`fixed right-4 z-30 flex items-center gap-2 rounded-full px-5 py-3 shadow-lg ${breakpointClass}`}
      style={{
        bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
        backgroundColor: "var(--color-accent)",
        color: "var(--color-on-marinara)",
      }}
    >
      <span aria-hidden>&#9679;</span>
      <span className="text-base font-semibold">
        {STOREFRONT_PARTNER.tagline}
      </span>
    </a>
  );
}
