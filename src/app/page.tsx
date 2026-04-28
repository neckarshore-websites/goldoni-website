import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { DeliveryBanner } from "@/components/DeliveryBanner";

export default function Home() {
  return (
    <main>
      {/* Delivery banner — first impression, points to Wolt + Uber Eats */}
      <DeliveryBanner />

      {/* Hero — restaurant wall sign on red velvet, brand-defining photo */}
      <section className="relative isolate overflow-hidden">
        <div className="relative h-[50vh] min-h-[336px] w-full sm:h-[56vh]">
          <Image
            src="/images/hero-goldoni-velvet.webp"
            alt="Ristorante Goldoni — Wandschild im Innenraum, gold auf rotem Samt"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Gradient overlay for CTA legibility (bottom-aligned) */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(26,22,18,0.15) 0%, rgba(26,22,18,0.05) 50%, rgba(26,22,18,0.75) 100%)",
            }}
          />
          {/* Foreground — tagline + CTAs */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-12 text-center sm:pb-16 sm:px-12">
            {/* H1 is rendered for SEO + a11y; visually the wall sign in the
                photo carries the brand. */}
            <h1 className="sr-only">{SITE.name}</h1>
            <p
              className="mb-6 max-w-2xl text-base text-white/95 sm:text-lg"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
            >
              {SITE.description}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/menu"
                className="rounded-md px-6 py-3 text-base font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "var(--tavola-salmon)",
                  color: "#FAFAFA",
                }}
              >
                Unsere Karte
              </Link>
              <a
                href={`tel:${SITE.phone}`}
                className="rounded-md border-2 px-6 py-3 text-base font-medium text-white transition-colors backdrop-blur-sm"
                style={{
                  borderColor: "rgba(255,255,255,0.6)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
              >
                Tisch reservieren · {SITE.phoneDisplay}
              </a>
            </div>
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
            «Der Mensch teilt nicht nur Leben und Heim mit anderen, sondern
            auch Brot und Speisen.»
          </blockquote>
          <cite
            className="mt-4 block text-sm not-italic"
            style={{ color: "var(--color-text-subtle)" }}
          >
            &mdash; Plutarch, Tischgespräche
          </cite>
        </div>
      </section>

      {/* Empfehlungskarte teaser — pointer to weekly recommendations */}
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
            Saisonale Gerichte, Wochenangebote und Wein-Tipps — was die
            Küche heute besonders empfiehlt.
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
            Mehr über Feiern &rarr;
          </Link>
        </div>
      </section>
    </main>
  );
}
