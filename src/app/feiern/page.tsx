import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { FeiernForm } from "@/components/forms/FeiernForm";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Feiern bei Goldoni — Private Anlässe in Stuttgart",
  description:
    "Hochzeiten, Geburtstage, Taufen, Firmenfeiern. Im Ristorante Goldoni richten wir Ihren privaten Anlass aus — mit individueller Karte und der Aufmerksamkeit, die er verdient.",
  alternates: { canonical: "/feiern" },
};

export default function FeiernPage() {
  return (
    <main>
      <StructuredData
        data={breadcrumbJsonLd([{ name: "Feiern", path: "/feiern" }])}
      />
      <PageHero
        src="/images/hero-feiern-essen.webp"
        alt="Eleganter Teller mit einem Gericht, Weingläser und ein festlich gedeckter Tisch — perfekt für Ihre Feier"
      />
      <div className="px-6 pb-20 pt-12 sm:px-12 sm:pb-24">
      <div className="mx-auto max-w-3xl">
        <p
          className="mb-3 text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-brand-olive)" }}
        >
          Privat &amp; Feierlich
        </p>
        <h1
          className="mb-6 text-4xl sm:text-5xl"
          style={{ color: "var(--color-text)" }}
        >
          Feiern bei Goldoni
        </h1>
        <p
          className="mb-10 text-lg leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Hochzeiten, Geburtstage, Taufen, Kommunionen, Firmenfeiern. Wir
          richten Ihren Anlass aus &mdash; im ganzen Restaurant oder in
          einem reservierten Bereich.
        </p>

        <h2
          className="mb-4 mt-12 text-2xl"
          style={{ color: "var(--color-text)" }}
        >
          Was wir bieten
        </h2>
        <ul className="space-y-3" style={{ color: "var(--color-text)" }}>
          <li className="flex gap-3">
            <span aria-hidden style={{ color: "var(--color-accent)" }}>
              &bull;
            </span>
            <span>
              <strong>Individuelle Karte</strong> &mdash; abgestimmt auf
              Anlass, Gästeanzahl und Vorlieben
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden style={{ color: "var(--color-accent)" }}>
              &bull;
            </span>
            <span>
              <strong>Sonntag vormittags verfügbar</strong> &mdash;
              Brunch, Tauffeier, Familienfest in entspannter Atmosphäre
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden style={{ color: "var(--color-accent)" }}>
              &bull;
            </span>
            <span>
              <strong>Wein- und Getränkebegleitung</strong> &mdash; aus
              unserem Keller passend zum Menü empfohlen
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden style={{ color: "var(--color-accent)" }}>
              &bull;
            </span>
            <span>
              <strong>Persönliche Beratung</strong> &mdash; Anfrage
              senden oder direkt anrufen
            </span>
          </li>
        </ul>

        {/* Feieranfrage form — primary path. Phone fallback below. */}
        <section
          className="mt-12 rounded-lg border p-6 sm:p-8"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg-muted)",
          }}
          aria-labelledby="feiern-form-heading"
        >
          <p
            className="mb-2 text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-brand-olive)" }}
          >
            Unverbindlich anfragen
          </p>
          <h2
            id="feiern-form-heading"
            className="mb-2 text-2xl sm:text-3xl"
            style={{ color: "var(--color-heading-italian)" }}
          >
            Feieranfrage
          </h2>
          <p
            className="mb-6"
            style={{ color: "var(--color-text-muted)" }}
          >
            Datum, Anlass und Gästeanzahl reichen für den ersten
            Aufschlag &mdash; wir rufen zurück und besprechen Karte und
            Details persönlich.
          </p>
          <FeiernForm />
        </section>

        {/* Phone fallback for visitors who prefer voice contact */}
        <div
          className="mt-8 flex flex-col gap-3 rounded-lg border p-6 sm:flex-row sm:items-center sm:justify-between"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          <p style={{ color: "var(--color-text-muted)" }}>
            Lieber direkt am Telefon? Auch gerne &mdash; wir besprechen
            alles im Detail.
          </p>
          <a
            href={`tel:${SITE.phone}`}
            className="shrink-0 inline-flex items-center gap-2 whitespace-nowrap rounded-md px-5 py-3 text-base font-medium"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "#FAFAFA",
            }}
            aria-label={`Anrufen: ${SITE.phoneDisplay}`}
          >
            {/* Inline phone icon — same path as Header PhoneIcon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Anrufen</span>
          </a>
        </div>
      </div>
      </div>
    </main>
  );
}
