/**
 * WeinSection — weekly wine recommendations for the Empfehlungskarte.
 *
 * Layout: two groups (Weiß / Rot), each wine rendered as a row with
 * name + producer line, region + grape line, and right-aligned prices
 * for bottle (0,75 l) and glass (0,2 l). Clean, readable, no clutter.
 */

import weinData from "@/data/weinempfehlungen.json";

interface Wine {
  name: string;
  producer: string;
  classification: string | null;
  year: number;
  region: string;
  grapes: string;
  priceBottle: string;
  priceGlass: string;
}

function WineRow({ wine }: { wine: Wine }) {
  const badge = [wine.classification, wine.year].filter(Boolean).join(" ");

  return (
    <li className="flex items-start justify-between gap-4 py-4">
      {/* Left — name + meta */}
      <div className="min-w-0">
        <p className="font-medium" style={{ color: "var(--color-text)" }}>
          {wine.name}
          {badge ? (
            <span
              className="ml-2 text-xs font-normal"
              style={{ color: "var(--color-text-muted)" }}
            >
              {badge}
            </span>
          ) : null}
        </p>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {wine.producer} &middot; {wine.region}
        </p>
        <p className="text-sm italic" style={{ color: "var(--color-text-subtle)" }}>
          {wine.grapes}
        </p>
      </div>

      {/* Right — prices */}
      <div
        className="shrink-0 text-right text-sm tabular-nums"
        style={{ color: "var(--color-text)" }}
      >
        <p>
          <span style={{ color: "var(--color-text-muted)" }}>0,75 l</span>
          {"  "}€&thinsp;{wine.priceBottle}
        </p>
        <p>
          <span style={{ color: "var(--color-text-muted)" }}>0,2 l</span>
          {"  "}€&thinsp;{wine.priceGlass}
        </p>
      </div>
    </li>
  );
}

function WineGroup({
  id,
  label,
  dot,
  wines,
}: {
  id?: string;
  label: string;
  dot: string;
  wines: Wine[];
}) {
  return (
    <div id={id}>
      {/* Group header */}
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
          <WineRow key={`${w.name}-${w.year}`} wine={w} />
        ))}
      </ul>
    </div>
  );
}

export function WeinSection() {
  return (
    <section id="weinempfehlungen" className="mt-14">
      {/* Section heading */}
      <div
        className="mb-6 border-t pt-10"
        style={{ borderColor: "var(--color-border)" }}
      >
        <p
          className="mb-1 text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-brand-olive)" }}
        >
          Diese Woche
        </p>
        <h2
          className="text-2xl sm:text-3xl"
          style={{ color: "var(--color-heading-italian)" }}
        >
          Weinempfehlungen
        </h2>
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Alle Weine auch glasweise — fragen Sie gerne nach Empfehlungen zur
          Speise.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <WineGroup
          id="weine-weiss"
          label="Weißweine"
          dot="#D4C060"
          wines={weinData.weiss as Wine[]}
        />
        <WineGroup
          id="weine-rot"
          label="Rotweine"
          dot="#8E2800"
          wines={weinData.rot as Wine[]}
        />
      </div>
    </section>
  );
}
