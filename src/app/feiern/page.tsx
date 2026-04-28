import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Feiern bei Goldoni — Private Anlaesse in Stuttgart",
  description:
    "Hochzeiten, Geburtstage, Taufen, Firmenfeiern. Im Ristorante Goldoni richten wir Ihren privaten Anlass aus &mdash; mit individueller Karte und der Aufmerksamkeit, die er verdient.",
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
            <span
              aria-hidden
              style={{ color: "var(--color-accent)" }}
            >
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
              <strong>Persoenliche Beratung</strong> &mdash; rufen Sie uns
              an, wir besprechen alles im Detail
            </span>
          </li>
        </ul>

        <div
          className="mt-12 rounded-lg border p-8"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg-muted)",
          }}
        >
          <h2
            className="mb-4 text-xl"
            style={{ color: "var(--color-text)" }}
          >
            Anfragen
          </h2>
          <p
            className="mb-4"
            style={{ color: "var(--color-text-muted)" }}
          >
            Am einfachsten ueber das Telefon &mdash; so klaeren wir Datum,
            Anzahl und Wuensche direkt.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${SITE.phone}`}
              className="rounded-md px-5 py-3 text-base font-medium"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg)",
              }}
            >
              {SITE.phoneDisplay}
            </a>
            <a
              href={`mailto:${SITE.email}?subject=Anfrage%20Feier`}
              className="rounded-md border px-5 py-3 text-base font-medium"
              style={{
                borderColor: "var(--color-border-strong)",
                color: "var(--color-text)",
              }}
            >
              {SITE.email}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
