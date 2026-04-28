import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum — Ristorante Goldoni",
  description: "Anbieterkennzeichnung gemaess § 5 TMG.",
  robots: { index: true, follow: false },
};

export default function ImpressumPage() {
  return (
    <main className="px-6 py-20 sm:px-12 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1
          className="mb-8 text-4xl sm:text-5xl"
          style={{ color: "var(--color-text)" }}
        >
          Impressum
        </h1>
        <div
          className="rounded-lg border-2 border-dashed p-8"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p style={{ color: "var(--color-text-muted)" }}>
            Inhalt folgt &mdash; rechtlich pruefen vor Live-Gang.
          </p>
        </div>
      </div>
    </main>
  );
}
