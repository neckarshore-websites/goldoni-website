import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Impressum — Ristorante Goldoni",
  description: "Anbieterkennzeichnung gemaess § 5 TMG.",
  robots: { index: true, follow: false },
};

export default function ImpressumPage() {
  return (
    <main>
      <PageHero
        src="/images/hero-impressum-trauben.webp"
        alt="Hände halten frisch geerntete dunkle Weintrauben — Symbol für italienische Gastfreundschaft"
      />
      <div className="px-6 pb-20 pt-12 sm:px-12 sm:pb-24">
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
      </div>
    </main>
  );
}
