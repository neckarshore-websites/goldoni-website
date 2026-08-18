import Link from "next/link";
import { SITE } from "@/lib/site";
import { DeliveryBanner } from "@/components/DeliveryBanner";
import { FaqSection } from "@/components/FaqSection";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { PhoneIcon } from "@/components/PhoneIcon";
import { ReviewsSection } from "@/components/ReviewsSection";
import { HolidayBanner, isSummerClosureWindow } from "@/components/HolidayBanner";
import { StructuredData } from "@/components/StructuredData";
import { SundayBanner } from "@/components/SundayBanner";
import { FAQS } from "@/data/faqs";
import { faqJsonLd } from "@/lib/structured-data";

/**
 * ISR: regenerate the home page at most every 6h. The page content is
 * otherwise static; this exists so the temporary SundayBanner can
 * auto-expire (its date check re-evaluates on each regeneration) without a
 * manual redeploy. Can revert to fully static once the banner is gone.
 */
export const revalidate = 21600;

export default function Home() {
  return (
    <main>
      <StructuredData data={faqJsonLd(FAQS)} />
      {/* Bestellbanner — eigener Kanal, ohne Fremdmarke.
          Betreiber-Entscheidung 2026-08-18: der Marktplatz-Teil (Uber-Eats-
          Kachel) und das Wolt-Zeichen entfallen auf der Website; der Knopf
          fuehrt unveraendert auf die Wolt-Bestellseite (~3,5 % statt ~30 %).
          Wolt bestaetigt: keine Anzeigepflicht fuer Uber Eats.

          BEWUSST OHNE ZEITFENSTER, ebenfalls Betreiber-Entscheidung vom
          2026-08-18: das Banner steht auch waehrend der Sommerpause. Es
          ersetzt die frueher hier haengende Unterdrueckung per
          isSummerClosureWindow() vom 2026-07-26. Der Urlaubshinweis darunter
          traegt die Information, dass die Kueche zu ist. */}
      <DeliveryBanner
        partners={SITE.delivery.filter((p) => p.channel === "own")}
        showBrandMark={false}
        subline="Alles direkt aus der Küche"
        intro={
          <>
            <strong className="font-medium">Auch nach Hause:</strong>{" "}
            Unsere ganze Karte, frisch zubereitet und zu Ihnen geliefert.
          </>
        }
      />
      {/* Summer-closure notice — the most consequential announcement on the
          page (three weeks fully shut) outranks both strips below it.

          TWO PHASES since 2026-07-30 (owner request): the banner goes up on
          30 July, four days BEFORE the closure starts, so guests still have a
          chance to come in; it then runs through the closure itself (3–23
          August) and hides on 24 August. The banner owns that earlier start
          alone — see BANNER_VISIBLE_FROM vs CLOSURE_STARTS_AT in the
          component. Deliberately NOT one shared start: the strips below key
          off the closure, not off the announcement. */}
      <HolidayBanner />
      {/*
        Sunday announcement only. The order button USED to be suppressed here
        as well (owner decision 2026-07-26: a shut kitchen cannot take an
        order). That suppression was lifted on 2026-08-18 by the owner — the
        banner above now runs year-round and the closure notice carries the
        "kitchen is shut" message. Do not reintroduce the coupling without a
        new decision; it was removed on purpose, not lost.

        Whether SundayBanner itself resumes AFTER 24 August is a separate,
        still-open decision (owner: depends on the weather) — untouched here.
        Its own component already stopped rendering permanently from 2 August
        via its own unrelated expiry; this wrapper only ever prevented it from
        showing during 3–23 August on top of that.
      */}
      {!isSummerClosureWindow() && (
        <div className="flex flex-col">
          <div className="order-2 sm:order-1">
            {/* Sunday announcement — temporary strip. Auto-expires after
                2 August 2026 (see component); additionally suppressed during
                the closure window by the wrapper above. */}
            <SundayBanner />
          </div>
        </div>
      )}

      {/* Hero — restaurant wall sign on red velvet, brand-defining photo */}
      <section className="relative isolate overflow-hidden">
        <div className="relative h-[52vh] min-h-[320px] w-full sm:h-[58vh]">
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
                className="inline-flex items-center justify-center gap-2 rounded-md border-2 px-6 py-3 text-base font-medium text-white transition-colors backdrop-blur-sm"
                style={{
                  borderColor: "rgba(255,255,255,0.6)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
                aria-label={`Tisch reservieren — anrufen unter ${SITE.phoneDisplay}`}
              >
                {/* Phone (<640px): compact icon + "Reservieren".
                    Tablet+Desktop (≥640px): full label with phone number. */}
                <PhoneIcon className="h-4 w-4 sm:hidden" />
                <span className="sm:hidden">Reservieren</span>
                <span className="hidden sm:inline">
                  Tisch reservieren · {SITE.phoneDisplay}
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Über uns teaser — on the deep Marinara field (red is the
          dominant colour of the restaurant interior: velvet wall, sugo,
          tomato). Replaces the former Plutarch "Philosophie" quote with
          a real house story + link to the dedicated /ueber-uns page
          (host story + 120-year building heritage). */}
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
            Das Haus
          </p>
          <h2 className="mb-6 text-3xl sm:text-4xl">
            Seit über 120 Jahren ein Ort der Gastlichkeit
          </h2>
          <p className="mx-auto mb-8 max-w-xl leading-relaxed opacity-95">
            Im denkmalgeschützten Jugendstil-Haus in der Reinsburgstraße führt
            Silvio das Goldoni — gehobene italienische Küche zu angemessenen
            Preisen und eine Gastfreundschaft, die ohne Aufhebens auskommt.
          </p>
          <Link
            href="/ueber-uns"
            className="inline-block rounded-md border-2 px-6 py-3 text-base font-medium transition-colors"
            style={{
              borderColor: "var(--color-on-marinara-muted)",
              color: "var(--color-on-marinara)",
            }}
          >
            Mehr über uns →
          </Link>
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

      {/* Kundenstimmen — Google reviews as a horizontally scrollable
          rail. Sits before Feiern so the social-proof beat lands right
          before the celebration CTA. Source data is statically pinned
          + anonymised in /src/data/google-reviews.json. */}
      <ReviewsSection />

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
