import { SITE } from "@/lib/site";
import { ReviewCard, type GoogleReview } from "@/components/ReviewCard";
import reviewsData from "@/data/google-reviews.json";

const REVIEWS = reviewsData as readonly GoogleReview[];

/**
 * ReviewsSection — Google reviews as a horizontally scrollable rail of
 * editorial cards. Sits between Empfehlungskarte (parmigiano block)
 * and Feiern (olive block) so the social-proof beat lands right
 * before the celebration-CTA.
 *
 * Implementation notes:
 * - Pure CSS scroll-snap + overflow-x-auto, no JS. Native swipe and
 *   trackpad-drag handle navigation; arrow buttons are intentionally
 *   omitted in v1 (progressive-enhancement candidate).
 * - Card widths use `basis-[N%]` so we get 1+peek on phone, 2 on
 *   tablet, 3 on desktop. The peek on phone is a deliberate
 *   affordance — it tells users "there's more, swipe me".
 * - Reviews are statically anonymised + shortened in
 *   `data/google-reviews.json`; no Places-API call at runtime.
 *
 * Open data point (TODO): the aggregate rating + total-review count
 * are not yet shown. Once the owner confirms the live numbers, add a
 * sub-line under the headline (e.g. "★★★★★ 4,9 · 247 Bewertungen").
 * The collective Google link is in place via SITE.googleReviewsUrl.
 */
export function ReviewsSection() {
  if (REVIEWS.length === 0) return null;

  return (
    <section
      aria-labelledby="reviews-heading"
      className="px-6 py-20 sm:px-12 sm:py-24"
      style={{
        backgroundColor: "var(--color-bg-muted)",
        color: "var(--color-text)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header — same eyebrow + headline rhythm as the other landing
            sections. Centred, max-w-3xl so the headline doesn't sprawl
            across the wider carousel container. */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p
            className="mb-3 text-xs uppercase tracking-[0.25em]"
            style={{ color: "var(--color-brand-olive)" }}
          >
            Auf Google bewertet
          </p>
          <h2
            id="reviews-heading"
            className="mb-4 text-3xl sm:text-4xl"
            style={{ color: "var(--color-heading-italian)" }}
          >
            Was unsere Gäste sagen
          </h2>
          <p
            className="mx-auto max-w-xl text-base"
            style={{ color: "var(--color-text-muted)" }}
          >
            Echtes Feedback unserer Gäste, direkt von Google Maps.
          </p>
        </div>

        {/* Carousel rail — scroll-snap on the x-axis. Negative inline
            margins on small screens let the cards bleed to the screen
            edge while the heading stays in the safe area.

            DO NOT add `scroll-smooth` here. Lighthouse 13's TraceEngine
            fails with `NO_LCP` on the homepage (4 LCP-Invalidate events,
            0 LCP-Candidate events) when `scroll-behavior: smooth` is
            applied to a horizontally-scrollable region with cumulative
            content width > viewport. Bisected 2026-05-04: removing the
            class restores measurability without losing UX (smooth-scroll
            only affects programmatic scrolls — none here, no arrow
            buttons, native swipe / trackpad inertia is platform-native). */}
        <div
          role="region"
          aria-label="Kundenstimmen aus Google Maps"
          data-reviews-rail
          className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:-mx-12 sm:gap-5 lg:mx-0"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Leading spacer mirrors the trailing spacer below; together
              they keep the first and last card visually inset on phones
              even though the rail itself bleeds edge-to-edge. */}
          <div className="shrink-0 basis-6 sm:basis-12 lg:hidden" aria-hidden />
          {REVIEWS.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              googleUrl={SITE.googleReviewsUrl}
              className="snap-start shrink-0 basis-[80%] sm:basis-[calc(50%-0.625rem)] lg:basis-[calc(33.333%-0.833rem)]"
            />
          ))}
          <div className="shrink-0 basis-6 sm:basis-12 lg:hidden" aria-hidden />
        </div>

        {/* Footer link — collective handover to the Google profile so
            visitors can read the unedited reviews and (hopefully) leave
            their own. */}
        <div className="mt-10 text-center">
          <a
            href={SITE.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
            style={{ color: "var(--color-accent)" }}
          >
            Alle Bewertungen auf Google ansehen
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
