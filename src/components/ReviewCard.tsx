import { ReviewAvatar } from "@/components/ReviewAvatar";

/**
 * GoogleReview — shape of one entry in `src/data/google-reviews.json`.
 * Lives next to the consumer because the JSON is the only source.
 */
export type GoogleReview = {
  id: string;
  author: string;
  initials: string;
  rating: 1 | 2 | 3 | 4 | 5;
  relativeDate: string;
  text: string;
};

/**
 * Five-star inline SVG. Rendered N times at the user's rating, then
 * (5-N) times as muted outlines. Inline so the section stays
 * zero-dependency — no icon library is in this codebase, and Lucide-
 * style imports would dwarf the actual asset cost.
 */
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      width="14"
      height="14"
      style={{ color: filled ? "var(--tavola-salmon)" : "var(--color-border-strong)" }}
    >
      <path
        fill="currentColor"
        d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78-4.21-4.1 5.82-.85L10 1.5z"
      />
    </svg>
  );
}

/**
 * ReviewCard — one Google review styled as an editorial chip.
 *
 * Fixed minimum height keeps the carousel rows visually flush even
 * with mixed text lengths. Cards are not links themselves (text needs
 * to stay selectable); instead a single trailing link sends the
 * curious reader to the full Google profile.
 *
 * `googleUrl` is shared across all cards (we link to the collective
 * Goldoni reviews page, not individual reviewer profiles) and comes
 * from `SITE.googleReviewsUrl`.
 */
export function ReviewCard({
  review,
  googleUrl,
  className = "",
}: {
  review: GoogleReview;
  googleUrl: string;
  className?: string;
}) {
  return (
    <article
      className={`flex min-h-[280px] flex-col rounded-2xl p-6 ${className}`}
      style={{
        backgroundColor: "var(--color-bg)",
        boxShadow: "0 1px 3px rgba(26, 22, 18, 0.06), 0 0 0 1px var(--color-border)",
      }}
    >
      <header className="mb-4 flex items-center gap-3">
        <ReviewAvatar initials={review.initials} seed={review.id} />
        <div className="min-w-0">
          <p
            className="truncate text-sm font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {review.author}
          </p>
          <p
            className="mt-0.5 flex items-center gap-2 text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span className="flex items-center gap-0.5" aria-label={`${review.rating} von 5 Sternen`}>
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} filled={i < review.rating} />
              ))}
            </span>
            <span aria-hidden>·</span>
            <span>{review.relativeDate}</span>
          </p>
        </div>
      </header>

      <p
        className="flex-1 text-sm leading-relaxed"
        style={{ color: "var(--color-text)" }}
      >
        {review.text}
      </p>

      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1 text-xs font-medium hover:underline"
        style={{ color: "var(--color-accent)" }}
        aria-label={`Bewertung von ${review.author} auf Google öffnen`}
      >
        Auf Google lesen
        <span aria-hidden>→</span>
      </a>
    </article>
  );
}
