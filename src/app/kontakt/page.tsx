import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt — Ristorante Goldoni",
  description:
    "Fragen, Sonderwünsche oder eine kurze Nachricht — schreiben Sie uns direkt. Das Ristorante Goldoni antwortet so schnell wie möglich.",
};

export default function KontaktPage() {
  return (
    <main>
      <PageHero
        src="/images/hero-kontakt-pizzo.webp"
        alt="Küstenstadt Pizzo in Kalabrien — Italiens Süden, Inspirationsquelle der Goldoni-Küche"
      />
      <div className="px-6 pb-20 pt-12 sm:px-12 sm:pb-24">
      <div className="mx-auto max-w-3xl">
        <p
          className="mb-3 text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-brand-olive)" }}
        >
          Kontakt
        </p>
        <h1
          className="mb-6 text-4xl sm:text-5xl"
          style={{ color: "var(--color-text)" }}
        >
          Schreiben Sie uns
        </h1>
        <p
          className="mb-6 text-lg leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Fragen, Sonderwünsche, Allergien &mdash; wir freuen uns über Ihre
          Nachricht und antworten so schnell wie möglich.
        </p>

        {/* Transit info */}
        <p
          className="mb-10 flex items-center gap-2 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          <span
            className="inline-flex items-center justify-center rounded px-1.5 py-0.5 text-xs font-bold tabular-nums"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "#FAFAFA",
              letterSpacing: "0.02em",
            }}
          >
            {SITE.transit.type} {SITE.transit.line}
          </span>
          <span>{SITE.transit.note}</span>
        </p>

        {/* Contact form */}
        <section
          className="rounded-lg border p-6 sm:p-8"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg-muted)",
          }}
          aria-labelledby="kontakt-form-heading"
        >
          <p
            className="mb-2 text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-brand-olive)" }}
          >
            Ihre Nachricht
          </p>
          <h2
            id="kontakt-form-heading"
            className="mb-2 text-2xl sm:text-3xl"
            style={{ color: "var(--color-heading-italian)" }}
          >
            Nachricht senden
          </h2>
          <p
            className="mb-6"
            style={{ color: "var(--color-text-muted)" }}
          >
            Für eine Feieranfrage finden Sie auf der Seite{" "}
            <a
              href="/feiern"
              className="underline"
              style={{ color: "var(--color-accent)" }}
            >
              Feiern
            </a>{" "}
            ein spezialisiertes Formular mit Datum und Gästeanzahl.
          </p>
          <ContactForm />
        </section>
      </div>
      </div>
    </main>
  );
}
