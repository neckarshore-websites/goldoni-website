import type { Metadata } from "next";
import Link from "next/link";

/**
 * Internal Style Guide — design-system reference.
 *
 * Not in the main navigation. Linked from the footer ("intern" section).
 * `noindex` so search engines stay out. No business copy — this is
 * a reference, not a page.
 *
 * Tokens render via CSS variables, so the toggle in the header switches
 * the entire guide between light and dark in real time.
 */
export const metadata: Metadata = {
  title: "Style Guide — Ristorante Goldoni (intern)",
  description: "Internes Design-System: Farben, Typografie, Komponenten.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/style-guide" },
};

type TavolaSwatch = {
  token: string;
  name: string;
  hex: string;
  origin: string;
};

const TAVOLA_PALETTE: TavolaSwatch[] = [
  {
    token: "--tavola-mozzarella",
    name: "Mozzarella",
    hex: "#FAFAFA",
    origin: "Bueffelmozzarella — hellster Ton (Weiss-Erweiterung).",
  },
  {
    token: "--tavola-parmigiano",
    name: "Parmigiano",
    hex: "#FEF1A5",
    origin: "Pale yellow vom Parmesan-Spaeneglanz im Restaurant.",
  },
  {
    token: "--tavola-lime",
    name: "Lime",
    hex: "#A69B02",
    origin: "Mustard-Lime der gruenen Pflanzen im Eingangsbereich.",
  },
  {
    token: "--tavola-olive",
    name: "Olive",
    hex: "#746B03",
    origin: "Tiefes Olivgruen — Pflanzen, Kraeuter, Flaschenetiketten.",
  },
  {
    token: "--tavola-salmon",
    name: "Salmon",
    hex: "#B64926",
    origin: "Terrakotta-Salmon der Wandfarbe / Sugo / Hauptwaerme.",
  },
  {
    token: "--tavola-marinara",
    name: "Marinara",
    hex: "#8E2800",
    origin: "Tiefer Tomatensauce-Ton — pressed-State, dunkler Akzent.",
  },
  {
    token: "--tavola-espresso",
    name: "Espresso",
    hex: "#1A1612",
    origin: "Warmer Espresso — Schwarz-Erweiterung, Body-Text auf Light.",
  },
];

type ColorToken = {
  token: string;
  name: string;
  light: string;
  dark: string;
  usage: string;
};

const COLOR_TOKENS: ColorToken[] = [
  {
    token: "--color-bg",
    name: "Background",
    light: "#FAFAFA",
    dark: "#1A1612",
    usage: "Page background. Tavola: mozzarella (light) / espresso (dark).",
  },
  {
    token: "--color-bg-muted",
    name: "Background Muted",
    light: "#F5EDD8",
    dark: "#26201A",
    usage: "Secondary surface — alternating section, footer, info-boxes.",
  },
  {
    token: "--color-text",
    name: "Text",
    light: "#1A1612",
    dark: "#FAFAFA",
    usage: "Primary body and heading text. Tavola: espresso / mozzarella inverted.",
  },
  {
    token: "--color-text-muted",
    name: "Text Muted",
    light: "#5C5240",
    dark: "#C9BD8A",
    usage: "Secondary text — descriptions, caption, helper-copy.",
  },
  {
    token: "--color-text-subtle",
    name: "Text Subtle",
    light: "#8B7E5C",
    dark: "#9C9061",
    usage: "Tertiary — footnotes, allergen-codes, small print.",
  },
  {
    token: "--color-border",
    name: "Border",
    light: "#EAE0C5",
    dark: "#3A2D1F",
    usage: "Hairlines, dividers, default input borders.",
  },
  {
    token: "--color-border-strong",
    name: "Border Strong",
    light: "#D4C7A5",
    dark: "#5A4830",
    usage: "Outline buttons, emphasised cards, focus secondary.",
  },
  {
    token: "--color-accent",
    name: "Accent — Salmon",
    light: "#B64926",
    dark: "#B64926",
    usage: "Primary CTA background, focus ring, highlights. Tavola: salmon.",
  },
  {
    token: "--color-accent-hover",
    name: "Accent Hover — Marinara",
    light: "#8E2800",
    dark: "#8E2800",
    usage: "CTA hover, pressed-state. Tavola: marinara.",
  },
  {
    token: "--color-brand-olive",
    name: "Brand Olive",
    light: "#746B03",
    dark: "#A69B02",
    usage: "Section labels, eyebrow text. Tavola: olive (light) / lime (dark).",
  },
  {
    token: "--color-brand-cream",
    name: "Brand Cream",
    light: "#FEF1A5",
    dark: "#3A350A",
    usage: "Diet-tag pill bg (veg / vegan / scharf). Tavola: parmigiano / dark-olive.",
  },
];

function ColorSwatch({ token }: { token: ColorToken }) {
  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div
        className="h-20"
        style={{ backgroundColor: `var(${token.token})` }}
        aria-label={`${token.name} swatch`}
      />
      <div
        className="border-t p-4"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-bg)",
        }}
      >
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-text)" }}
        >
          {token.name}
        </p>
        <p
          className="mt-0.5 font-mono text-xs"
          style={{ color: "var(--color-text-subtle)" }}
        >
          {token.token}
        </p>
        <p
          className="mt-2 font-mono text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          light {token.light} · dark {token.dark}
        </p>
        <p
          className="mt-2 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          {token.usage}
        </p>
      </div>
    </div>
  );
}

export default function StyleGuidePage() {
  return (
    <main className="px-6 py-20 sm:px-12 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <p
          className="mb-3 text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-brand-olive)" }}
        >
          Intern
        </p>
        <h1
          className="mb-4 text-4xl sm:text-5xl"
          style={{ color: "var(--color-text)" }}
        >
          Style Guide
        </h1>
        <p
          className="mb-12 max-w-3xl text-lg leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Tokens, Typografie und Komponenten von Ristorante Goldoni. Diese
          Seite ist eine Referenz für Pflege und Erweiterung. Mit dem
          Theme-Toggle in der Kopfzeile lässt sich die Seite zwischen Hell
          und Dunkel umschalten — alle Werte aktualisieren sich live.
        </p>

        {/* Tavola — brand palette extracted from restaurant photo */}
        <section className="mb-16">
          <h2
            className="mb-2 text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Tavola
          </h2>
          <p
            className="mb-6 max-w-2xl"
            style={{ color: "var(--color-text-muted)" }}
          >
            Brand-Palette, abgeleitet aus einer Aufnahme des Restaurant-Innenraums.
            Italian-food-themed Namen. Source-of-truth für alle Farben — die
            semantischen Tokens unten mappen auf diese Layer.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {TAVOLA_PALETTE.map((s) => (
              <div
                key={s.token}
                className="overflow-hidden rounded-lg border"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div
                  className="h-24"
                  style={{ backgroundColor: s.hex }}
                  aria-label={`${s.name} swatch`}
                />
                <div
                  className="border-t p-3"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-bg)",
                  }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text)" }}
                  >
                    {s.name}
                  </p>
                  <p
                    className="mt-0.5 font-mono text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {s.hex}
                  </p>
                  <p
                    className="mt-0.5 font-mono text-xs"
                    style={{ color: "var(--color-text-subtle)" }}
                  >
                    {s.token}
                  </p>
                  <p
                    className="mt-2 text-xs"
                    style={{ color: "var(--color-text-subtle)" }}
                  >
                    {s.origin}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Semantic colors — what components actually use */}
        <section className="mb-16">
          <h2
            className="mb-2 text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Semantische Tokens
          </h2>
          <p
            className="mb-6 max-w-2xl"
            style={{ color: "var(--color-text-muted)" }}
          >
            Was Komponenten täglich nutzen — gemappt auf die Tavola-Palette
            oben. Diese Werte ändern sich je Theme (Hell / Dunkel).
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLOR_TOKENS.map((token) => (
              <ColorSwatch key={token.token} token={token} />
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2
            className="mb-6 text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Typografie
          </h2>
          <div className="space-y-6">
            <div
              className="rounded-lg border p-6"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p
                className="mb-2 font-mono text-xs"
                style={{ color: "var(--color-text-subtle)" }}
              >
                Display · Playfair Display · 600
              </p>
              <p
                className="text-5xl leading-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-text)",
                }}
              >
                Bella Italia in Stuttgart
              </p>
            </div>
            <div
              className="rounded-lg border p-6"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p
                className="mb-2 font-mono text-xs"
                style={{ color: "var(--color-text-subtle)" }}
              >
                Heading · Playfair Display · 600 · text-3xl
              </p>
              <h3
                className="text-3xl"
                style={{ color: "var(--color-text)" }}
              >
                Antipasti, Pasta, Pizze
              </h3>
            </div>
            <div
              className="rounded-lg border p-6"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p
                className="mb-2 font-mono text-xs"
                style={{ color: "var(--color-text-subtle)" }}
              >
                Body · Inter Variable · 400 · text-base
              </p>
              <p style={{ color: "var(--color-text)" }}>
                Italienisch verliebte Kueche — frische Zutaten, mit Liebe
                gemacht. Geroestetes Brot mit Tomaten, Knoblauch, Basilikum.
              </p>
            </div>
            <div
              className="rounded-lg border p-6"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p
                className="mb-2 font-mono text-xs"
                style={{ color: "var(--color-text-subtle)" }}
              >
                Eyebrow · Inter · uppercase · tracking-[0.2em]
              </p>
              <p
                className="text-xs uppercase tracking-[0.2em]"
                style={{ color: "var(--color-brand-olive)" }}
              >
                Diese Woche
              </p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2
            className="mb-6 text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Buttons
          </h2>
          <div
            className="flex flex-wrap gap-4 rounded-lg border p-6"
            style={{ borderColor: "var(--color-border)" }}
          >
            <button
              type="button"
              className="rounded-md px-6 py-3 text-base font-medium transition-colors"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg)",
              }}
            >
              Primary — Reservieren
            </button>
            <button
              type="button"
              className="rounded-md border px-6 py-3 text-base font-medium transition-colors"
              style={{
                borderColor: "var(--color-border-strong)",
                color: "var(--color-text)",
              }}
            >
              Secondary — Karte ansehen
            </button>
            <Link
              href="#"
              className="inline-block self-center border-b-2 pb-1 text-base font-medium"
              style={{
                borderColor: "var(--color-accent)",
                color: "var(--color-accent)",
              }}
            >
              Tertiary &rarr;
            </Link>
          </div>
        </section>

        {/* Menu item example */}
        <section className="mb-16">
          <h2
            className="mb-6 text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Menu-Item
          </h2>
          <div
            className="rounded-lg border"
            style={{ borderColor: "var(--color-border)" }}
          >
            <ul>
              <li
                className="flex flex-col gap-1 border-b p-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3
                      className="text-base font-medium"
                      style={{
                        color: "var(--color-text)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      Lasagna fatta in casa con ragù di carne mista locale
                    </h3>
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-text-subtle)" }}
                    >
                      (A, C, G, I, S)
                    </span>
                  </div>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Hausgemachte Lasagne mit regionalem Fleisch
                    (Rind, Kalb, Schwein)
                  </p>
                </div>
                <div
                  className="shrink-0 font-medium tabular-nums"
                  style={{ color: "var(--color-text)" }}
                >
                  17.50&nbsp;&euro;
                </div>
              </li>
              <li className="flex flex-col gap-1 p-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3
                      className="text-base font-medium"
                      style={{
                        color: "var(--color-text)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      Penne all&apos;Arrabbiata
                    </h3>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs"
                      style={{
                        backgroundColor: "var(--color-brand-cream)",
                        color: "var(--color-brand-olive)",
                      }}
                    >
                      vegan
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs"
                      style={{
                        backgroundColor: "var(--color-brand-cream)",
                        color: "var(--color-brand-olive)",
                      }}
                    >
                      scharf
                    </span>
                  </div>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Penne in scharfer Tomatensauce mit Knoblauch und Chili
                  </p>
                </div>
                <div
                  className="shrink-0 font-medium tabular-nums"
                  style={{ color: "var(--color-text)" }}
                >
                  12.50&nbsp;&euro;
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Spacing scale */}
        <section className="mb-16">
          <h2
            className="mb-6 text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Abstaende
          </h2>
          <div
            className="space-y-3 rounded-lg border p-6"
            style={{ borderColor: "var(--color-border)" }}
          >
            {[
              { token: "--spacing-1", value: "4px" },
              { token: "--spacing-2", value: "8px" },
              { token: "--spacing-3", value: "12px" },
              { token: "--spacing-4", value: "16px" },
              { token: "--spacing-6", value: "24px" },
              { token: "--spacing-8", value: "32px" },
              { token: "--spacing-12", value: "48px" },
              { token: "--spacing-16", value: "64px" },
              { token: "--spacing-24", value: "96px" },
            ].map((s) => (
              <div key={s.token} className="flex items-center gap-4">
                <span
                  className="font-mono text-xs"
                  style={{
                    color: "var(--color-text-subtle)",
                    minWidth: "8rem",
                  }}
                >
                  {s.token}
                </span>
                <span
                  className="font-mono text-xs"
                  style={{
                    color: "var(--color-text-muted)",
                    minWidth: "3rem",
                  }}
                >
                  {s.value}
                </span>
                <div
                  className="h-3 rounded-sm"
                  style={{
                    width: s.value,
                    backgroundColor: "var(--color-accent)",
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Theme behaviour note */}
        <section
          className="rounded-lg border p-6"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg-muted)",
          }}
        >
          <h2
            className="mb-3 text-xl"
            style={{ color: "var(--color-text)" }}
          >
            Theme-Verhalten
          </h2>
          <p
            className="mb-3"
            style={{ color: "var(--color-text-muted)" }}
          >
            Default ist <strong style={{ color: "var(--color-text)" }}>Hell</strong>{" "}
            — passt zum Restaurant-Erlebnis und zur älteren Stamm-Kundschaft.
            Der Toggle in der Kopfzeile schaltet auf{" "}
            <strong style={{ color: "var(--color-text)" }}>Dunkel</strong>{" "}
            (warmes Espresso, kein kaltes Schwarz) — für mobile
            Bestell-Nutzung am Abend.
          </p>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-subtle)" }}
          >
            Implementierung: <code style={{ color: "var(--color-text-muted)" }}>data-theme</code>{" "}
            auf <code style={{ color: "var(--color-text-muted)" }}>&lt;html&gt;</code>,
            persistiert in <code style={{ color: "var(--color-text-muted)" }}>localStorage</code>.
            Anti-Flash via <code style={{ color: "var(--color-text-muted)" }}>/theme-init.js</code>{" "}
            (läuft vor erstem Paint).
          </p>
        </section>
      </div>
    </main>
  );
}
