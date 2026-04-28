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
    light: "#FAF6EF",
    dark: "#1F1813",
    usage: "Page background. Hero, card surfaces, hero-section.",
  },
  {
    token: "--color-bg-muted",
    name: "Background Muted",
    light: "#F0E9DD",
    dark: "#2A2018",
    usage: "Secondary surface — alternating section, footer, info-boxes.",
  },
  {
    token: "--color-text",
    name: "Text",
    light: "#2A1F17",
    dark: "#F5EBDB",
    usage: "Primary body and heading text.",
  },
  {
    token: "--color-text-muted",
    name: "Text Muted",
    light: "#6B5A4C",
    dark: "#B8A88E",
    usage: "Secondary text — descriptions, caption, helper-copy.",
  },
  {
    token: "--color-text-subtle",
    name: "Text Subtle",
    light: "#8B7B6E",
    dark: "#9E8E76",
    usage: "Tertiary — footnotes, allergen-codes, small print.",
  },
  {
    token: "--color-border",
    name: "Border",
    light: "#E8DDC9",
    dark: "#3A2D1F",
    usage: "Hairlines, dividers, default input borders.",
  },
  {
    token: "--color-border-strong",
    name: "Border Strong",
    light: "#D4C5AC",
    dark: "#4F3F2D",
    usage: "Outline buttons, emphasised cards, focus secondary.",
  },
  {
    token: "--color-accent",
    name: "Accent — Terrakotta",
    light: "#C25B43",
    dark: "#E07658",
    usage: "Primary CTA background, focus ring, highlights.",
  },
  {
    token: "--color-accent-hover",
    name: "Accent Hover",
    light: "#9F4634",
    dark: "#C25B43",
    usage: "CTA hover, pressed-state.",
  },
  {
    token: "--color-brand-olive",
    name: "Brand Olive",
    light: "#5C6B3D",
    dark: "#8FA063",
    usage: "Section labels, eyebrow text, link underline-accent.",
  },
  {
    token: "--color-brand-cream",
    name: "Brand Cream",
    light: "#E8DDC9",
    dark: "#2A2018",
    usage: "Diet-tag pill background (veg / vegan / scharf).",
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
          Seite ist eine Referenz fuer Pflege und Erweiterung. Mit dem
          Theme-Toggle in der Kopfzeile laesst sich die Seite zwischen Hell
          und Dunkel umschalten — alle Werte aktualisieren sich live.
        </p>

        {/* Colors */}
        <section className="mb-16">
          <h2
            className="mb-6 text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Farben
          </h2>
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
            — passt zum Restaurant-Erlebnis und zur aelteren Stamm-Kundschaft.
            Der Toggle in der Kopfzeile schaltet auf{" "}
            <strong style={{ color: "var(--color-text)" }}>Dunkel</strong>{" "}
            (warmes Espresso, kein kaltes Schwarz) — fuer mobile
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
            (laeuft vor erstem Paint).
          </p>
        </section>
      </div>
    </main>
  );
}
