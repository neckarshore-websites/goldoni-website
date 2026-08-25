import { STOREFRONT_PARTNER } from "@/lib/site";

/**
 * Schwebender Bestell-Knopf — Variante B der Handy-Beurteilung (2026-08-25).
 *
 * Sitzt fest am unteren Rand, rechts, und bleibt beim Blättern stehen. Er
 * kostet keine Höhe am oberen Rand — dafür überlagert er die Karte, und zwar
 * dauerhaft. Das ist der Handel, über den entschieden wird.
 *
 * NUR UNTER `md`. Am Desktop stehen seit dem 25.08. die Knöpfe neben der
 * Überschrift und in der Karte; ein zusätzlicher schwebender wäre dort
 * Doppelung.
 *
 * `bottom` respektiert `env(safe-area-inset-bottom)`, damit der Knopf auf
 * iPhones nicht unter der Home-Leiste klebt.
 */
export function OrderFab() {
  return (
    <a
      href={STOREFRONT_PARTNER.url}
      target="_blank"
      rel="noopener"
      data-testid="order-cta-fab"
      className="fixed right-4 z-30 flex items-center gap-2 rounded-full px-5 py-3 shadow-lg md:hidden"
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
