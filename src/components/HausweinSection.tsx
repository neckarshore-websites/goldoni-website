/**
 * HausweinSection — Vini della Casa for the main Speisekarte (/menu).
 *
 * Visually mirrors WeinSection (used on /empfehlungen) but renders a
 * simpler schema: house wines have no producer, no year, no
 * classification, no bottle price. Just name + glass-volume + glass-price
 * + Sulfite-pill. Three subgroups with the same colored-dot treatment
 * as WeinSection: Weißweine (gold), Rosato (rosé), Rotweine (rusty red).
 *
 * Data source: `src/data/weinempfehlungen.json` → `hauswein` field.
 * Placement on /menu: directly after Benvenuti, before Analcolici —
 * Italian drink-pacing (Aperitif → Wein → Bier → Spirits → alkoholfrei).
 */

import weinData from "@/data/weinempfehlungen.json";

interface Hauswein {
  name: string;
  volume: string;
  priceGlass: string;
  allergens?: string[];
}

function HausweinRow({ wine }: { wine: Hauswein }) {
  return (
    <li
      className="flex items-baseline justify-between gap-4 py-3"
    >
      <div className="flex flex-wrap items-baseline gap-2">
        <p
          className="font-medium"
          style={{ color: "var(--color-text)" }}
        >
          {wine.name}
        </p>
        {wine.allergens && wine.allergens.length > 0 ? (
          <span
            className="text-xs"
            style={{ color: "var(--color-text-subtle)" }}
          >
            ({wine.allergens.join(", ")})
          </span>
        ) : null}
      </div>
      <div
        className="shrink-0 text-right text-sm tabular-nums"
        style={{ color: "var(--color-text)" }}
      >
        <span style={{ color: "var(--color-text-muted)" }}>
          {wine.volume}
        </span>
        {"  "}€&thinsp;{wine.priceGlass}
      </div>
    </li>
  );
}

function HausweinGroup({
  id,
  label,
  dot,
  wines,
}: {
  id: string;
  label: string;
  dot: string;
  wines: Hauswein[];
}) {
  if (wines.length === 0) return null;
  return (
    <div id={id}>
      <div className="mb-1 flex items-center gap-3">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: dot }}
          aria-hidden
        />
        <h3
          className="text-xs font-medium uppercase tracking-[0.18em]"
          style={{ color: "var(--color-brand-olive)" }}
        >
          {label}
        </h3>
      </div>
      <ul
        className="divide-y"
        style={{ borderColor: "var(--color-border)" }}
      >
        {wines.map((w) => (
          <HausweinRow key={w.name} wine={w} />
        ))}
      </ul>
    </div>
  );
}

export function HausweinSection() {
  const data = weinData.hauswein ?? { weiss: [], rosato: [], rot: [] };

  return (
    <section
      id="hauswein"
      className="mt-14"
      style={{
        scrollMarginTop:
          "calc(var(--goldoni-header-h, 4.5rem) + var(--goldoni-pills-h, 3rem) + 1rem)",
      }}
    >
      <div
        className="mb-6 border-t pt-10"
        style={{ borderColor: "var(--color-border)" }}
      >
        <p
          className="mb-1 text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-brand-olive)" }}
        >
          Diese Karte
        </p>
        <h2
          className="text-2xl sm:text-3xl"
          style={{ color: "var(--color-heading-italian)" }}
        >
          Vini della Casa
        </h2>
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Hausweine, glasweise — frisch und unkompliziert zum Essen.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <HausweinGroup
          id="hauswein-weiss"
          label="Weißweine"
          dot="#D4C060"
          wines={data.weiss as Hauswein[]}
        />
        <HausweinGroup
          id="hauswein-rosato"
          label="Rosato"
          dot="#E1A4A0"
          wines={data.rosato as Hauswein[]}
        />
        <HausweinGroup
          id="hauswein-rot"
          label="Rotweine"
          dot="#8E2800"
          wines={data.rot as Hauswein[]}
        />
      </div>
    </section>
  );
}
