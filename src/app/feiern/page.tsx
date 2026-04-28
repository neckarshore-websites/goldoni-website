import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { FeiernForm } from "@/components/forms/FeiernForm";

export const metadata: Metadata = {
  title: "Feiern bei Goldoni — Private Anlaesse in Stuttgart",
  description:
    "Hochzeiten, Geburtstage, Taufen, Firmenfeiern. Im Ristorante Goldoni richten wir Ihren privaten Anlass aus — mit individueller Karte und der Aufmerksamkeit, die er verdient.",
};

export default function FeiernPage() {
  return (
    <main className="px-6 py-20 sm:px-12 sm:py-24">
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
              Anlass, Gaesteanzahl und Vorlieben
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden style={{ color: "var(--color-accent)" }}>
              &bull;
            </span>
            <span>
              <strong>Sonntag vormittags verfuegbar</strong> &mdash;
              Brunch, Tauffeier, Familienfest in entspannter Atmosphaere
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden style={{ color: "var(--color-accent)" }}>
              &bull;
            </span>
            <span>
              <strong>Wein- und Getraenkebegleitung</strong> &mdash; aus
              unserem Keller passend zum Menue empfohlen
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden style={{ color: "var(--color-accent)" }}>
              &bull;
            </span>
            <span>
              <strong>Persoenliche Beratung</strong> &mdash; Anfrage
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
            Datum, Anlass und Gaesteanzahl reichen fuer den ersten
            Aufschlag &mdash; wir rufen zurueck und besprechen Karte und
            Details persoenlich.
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
            className="rounded-md px-5 py-3 text-base font-medium"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "#FAFAFA",
            }}
          >
            {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </main>
  );
}
