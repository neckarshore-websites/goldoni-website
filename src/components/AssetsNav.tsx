import Link from "next/link";

/**
 * Mini-Navigation der internen /assets-Seiten.
 *
 * Die Seite trug bis 2026-08-25 genau einen Gegenstand: Bildaufträge mit
 * ihren Prompts. Mit den Drucksachen kamen zwei weitere Arten hinzu, die
 * nichts miteinander zu tun haben ausser dem Ort — deshalb eigene Seiten
 * statt einer immer längeren Liste, und deshalb diese Leiste.
 *
 * Bewusst KEINE aktive Kategorie-Erkennung per usePathname: das würde die
 * Leiste zu einer Client-Komponente machen. Die Seiten übergeben ihren
 * eigenen Schlüssel — sie wissen ohnehin, wer sie sind.
 */
const ENTRIES = [
  { key: "bilder", href: "/assets", label: "Bilder & Prompts" },
  { key: "postkarte", href: "/assets/postkarte", label: "Postkarte" },
  { key: "bierdeckel", href: "/assets/bierdeckel", label: "Bierdeckel" },
  { key: "briefumschlag", href: "/assets/briefumschlag", label: "Briefumschlag" },
  { key: "pizzakarton", href: "/assets/pizzakarton", label: "Pizzakarton" },
] as const;

export type AssetsNavKey = (typeof ENTRIES)[number]["key"];

export function AssetsNav({ current }: { current: AssetsNavKey }) {
  return (
    <nav aria-label="Assets" className="flex flex-wrap gap-2">
      {ENTRIES.map((e) => {
        const isCurrent = e.key === current;
        return (
          <Link
            key={e.key}
            href={e.href}
            aria-current={isCurrent ? "page" : undefined}
            className="rounded-full border px-4 py-1.5 text-sm transition-colors"
            style={{
              borderColor: isCurrent
                ? "var(--color-accent)"
                : "var(--color-border-strong)",
              backgroundColor: isCurrent ? "var(--color-accent)" : "transparent",
              color: isCurrent ? "var(--color-bg)" : "var(--color-text)",
            }}
          >
            {e.label}
          </Link>
        );
      })}
    </nav>
  );
}
