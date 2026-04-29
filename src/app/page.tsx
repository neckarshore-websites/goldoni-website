import Link from "next/link";
import { SITE } from "@/lib/site";
import { DeliveryBanner } from "@/components/DeliveryBanner";
import { FaqSection } from "@/components/FaqSection";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { StructuredData } from "@/components/StructuredData";
import { FAQS } from "@/data/faqs";
import { faqJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <main>
      <StructuredData data={faqJsonLd(FAQS)} />
      {/* Delivery banner — first impression, points to Wolt + Uber Eats */}
      <DeliveryBanner />

      {/* Hero — restaurant wall sign on red velvet, brand-defining photo */}
      <section className="relative isolate overflow-hidden">
        <div className="relative h-[34vh] min-h-[240px] w-full sm:h-[38vh]">
          <HeroSlideshow />
          {/* Gradient overlay for CTA legibility (bottom-aligned).
              z-index: 2 keeps it above the active slide (z-index: 1) so the
              gradient and CTA are never occluded during crossfade transitions. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              zIndex: 2,
              background:
                "linear-gradient(to bottom, rgba(26,22,18,0.10) 0%, rgba(26,22,18,0.30) 55%, rgba(26,22,18,0.88) 100%)",
            }}
          />
          {/* Foreground — tagline + CTAs. z-index: 3 sits above gradient. */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-8 text-center sm:pb-10 sm:px-12" style={{ zIndex: 3 }}>
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

      {/* Philosophie — Plutarch quote on a deep Marinara field. The
          editorial colour block carries the brand: red is the dominant
          colour of the restaurant interior (velvet wall, sugo, tomato),
          and a full-bleed section makes it actually visible on the
          homepage instead of cream-on-cream. */}
      <section
        className="px-6 py-24 sm:px-12 sm:py-28"
        style={{
          backgroundColor: "var(--color-bg-marinara)",
          color: "var(--color-on-marinara)",
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="mb-4 text-xs uppercase tracking-[0.25em]"
            style={{ color: "var(--color-on-marinara-muted)" }}
          >
            Tischgespräche
          </p>
          <h2 className="mb-8 text-3xl sm:text-4xl">Brot und Speisen</h2>
          <blockquote className="font-display text-xl italic leading-relaxed sm:text-2xl">
            «Der Mensch teilt nicht nur Leben und Heim mit anderen, sondern
            auch Brot und Speisen.»
          </blockquote>
          <cite
            className="mt-6 block text-sm not-italic"
            style={{ color: "var(--color-on-marinara-muted)" }}
          >
            &mdash; Plutarch, Tischgespräche
          </cite>
        </div>
      </section>

      {/* Empfehlungskarte teaser — Parmigiano-cream block sits between
          the two deep colour bands above (Marinara) and below (Olive).
          The cream-yellow gives the page a third colour beat without
          shouting. */}
      <section
        className="px-6 py-20 sm:px-12 sm:py-24"
        style={{
          backgroundColor: "var(--color-bg-parmigiano)",
          color: "var(--color-text)",
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="mb-3 text-xs uppercase tracking-[0.25em]"
            style={{ color: "var(--color-brand-olive)" }}
          >
            Diese Woche
          </p>
          <h2
            className="mb-6 text-3xl sm:text-4xl"
            style={{ color: "var(--color-heading-italian)" }}
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
            className="inline-block rounded-md px-6 py-3 text-base font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "#FAFAFA",
            }}
          >
            Zu den Empfehlungen &rarr;
          </Link>
        </div>
      </section>

      {/* Feiern teaser — Olive field for the celebration message.
          Warm, grounded, and unmistakably restaurant-not-tech. */}
      <section
        className="px-6 py-24 sm:px-12 sm:py-28"
        style={{
          backgroundColor: "var(--color-bg-olive)",
          color: "var(--color-on-olive)",
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="mb-3 text-xs uppercase tracking-[0.25em]"
            style={{ color: "var(--color-on-olive-muted)" }}
          >
            Privat &amp; Feierlich
          </p>
          <h2 className="mb-6 text-3xl sm:text-4xl">Feiern Sie bei uns</h2>
          <p className="mx-auto mb-8 max-w-xl opacity-90">
            Hochzeiten, Geburtstage, Taufen, Firmenfeiern. Wir richten Ihren
            Anlass aus &mdash; mit individueller Karte und der Aufmerksamkeit,
            die er verdient.
          </p>
          <Link
            href="/feiern"
            className="inline-block rounded-md border-2 px-6 py-3 text-base font-medium transition-colors"
            style={{
              borderColor: "var(--color-on-olive-muted)",
              color: "var(--color-on-olive)",
            }}
          >
            Mehr über Feiern &rarr;
          </Link>
        </div>
      </section>

      {/* Häufige Fragen — closes the homepage with practical info
          (hours, reservations, delivery, location, allergens) and
          earns Google's FAQ rich result via the FAQPage JSON-LD
          rendered above. */}
      <FaqSection faqs={FAQS} />
    </main>
  );
}
