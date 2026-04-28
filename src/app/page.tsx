import Link from "next/link";
import { SITE } from "@/lib/site";
import { DeliveryBanner } from "@/components/DeliveryBanner";

export default function Home() {
  return (
    <main>
      {/* Delivery banner — first impression, points to Wolt + Uber Eats */}
      <DeliveryBanner />

      {/* Hero */}
      <section
        className="px-6 py-24 sm:px-12 sm:py-32 lg:py-40"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="mb-4 text-sm uppercase tracking-[0.2em]"
            style={{ color: "var(--color-brand-olive)" }}
          >
            {SITE.tagline}
          </p>
          <h1
            className="mb-6 text-5xl leading-tight sm:text-6xl lg:text-7xl"
            style={{ color: "var(--color-text)" }}
          >
            Ristorante <span style={{ color: "var(--color-accent)" }}>Goldoni</span>
          </h1>
          <p
            className="mx-auto mb-10 max-w-2xl text-lg sm:text-xl"
            style={{ color: "var(--color-text-muted)" }}
          >
            {SITE.description}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/menu"
              className="rounded-md px-6 py-3 text-base font-medium transition-colors"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg)",
              }}
            >
              Unsere Karte
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="rounded-md border px-6 py-3 text-base font-medium transition-colors"
              style={{
                borderColor: "var(--color-border-strong)",
                color: "var(--color-text)",
              }}
            >
              Tisch reservieren · {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* Philosophie — Plutarch quote, classic Trattoria voice */}
      <section
        className="border-y px-6 py-20 sm:px-12 sm:py-24"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-bg-muted)",
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="mb-6 text-3xl sm:text-4xl"
            style={{ color: "var(--color-text)" }}
          >
            Brot und Speisen
          </h2>
          <blockquote
            className="font-display text-lg italic leading-relaxed sm:text-xl"
            style={{ color: "var(--color-text-muted)" }}
          >
            &laquo;Der Mensch teilt nicht nur Leben und Heim mit anderen, sondern
            auch Brot und Speisen.&raquo;
          </blockquote>
          <cite
            className="mt-4 block text-sm not-italic"
            style={{ color: "var(--color-text-subtle)" }}
          >
            &mdash; Plutarch, Tischgespraeche
          </cite>
        </div>
      </section>

      {/* Empfehlungskarte teaser — placeholder until skill/data is wired */}
      <section className="px-6 py-20 sm:px-12 sm:py-24" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="mb-3 text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-brand-olive)" }}
          >
            Diese Woche
          </p>
          <h2
            className="mb-6 text-3xl sm:text-4xl"
            style={{ color: "var(--color-text)" }}
          >
            Aktuelle Empfehlungen
          </h2>
          <p
            className="mx-auto mb-8 max-w-xl"
            style={{ color: "var(--color-text-muted)" }}
          >
            Saisonale Gerichte, Wochenangebote und Wein-Tipps &mdash; was die
            Kueche heute besonders empfiehlt.
          </p>
          <Link
            href="/empfehlungen"
            className="inline-block border-b-2 pb-1 text-base font-medium transition-colors"
            style={{
              borderColor: "var(--color-accent)",
              color: "var(--color-accent)",
            }}
          >
            Zu den Empfehlungen &rarr;
          </Link>
        </div>
      </section>

      {/* Feiern teaser */}
      <section
        className="border-t px-6 py-20 sm:px-12 sm:py-24"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-bg-muted)",
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="mb-3 text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-brand-olive)" }}
          >
            Privat &amp; Feierlich
          </p>
          <h2
            className="mb-6 text-3xl sm:text-4xl"
            style={{ color: "var(--color-text)" }}
          >
            Feiern Sie bei uns
          </h2>
          <p
            className="mx-auto mb-8 max-w-xl"
            style={{ color: "var(--color-text-muted)" }}
          >
            Hochzeiten, Geburtstage, Taufen, Firmenfeiern. Wir richten Ihren
            Anlass aus &mdash; mit individueller Karte und der Aufmerksamkeit,
            die er verdient.
          </p>
          <Link
            href="/feiern"
            className="inline-block border-b-2 pb-1 text-base font-medium transition-colors"
            style={{
              borderColor: "var(--color-accent)",
              color: "var(--color-accent)",
            }}
          >
            Mehr ueber Feiern &rarr;
          </Link>
        </div>
      </section>
    </main>
  );
}
