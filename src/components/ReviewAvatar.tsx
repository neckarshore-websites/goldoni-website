/**
 * ReviewAvatar — circular initials chip for a Google-style review card.
 *
 * Why initials, not photos: we render anonymised review data ("Tim D.")
 * sourced from publicly visible Google Maps reviews. Embedding the
 * reviewer's actual profile photo would cross a DSGVO line we don't
 * need to cross — initials carry the same recognition cue without
 * the third-party-image baggage.
 *
 * Colour: deterministic 5-way split across the Tavola brand palette.
 * The hash is intentionally trivial (sum of charCodes) — we want
 * "same name → same swatch every reload", not cryptographic spread.
 */

const SWATCHES = [
  "var(--tavola-salmon)",   // terracotta
  "var(--tavola-marinara)", // deep red
  "var(--tavola-olive)",    // dark olive
  "var(--tavola-lime)",     // mustard-lime
  "var(--tavola-espresso)", // warm dark
] as const;

function pickSwatch(seed: string): string {
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
  return SWATCHES[sum % SWATCHES.length];
}

export function ReviewAvatar({
  initials,
  seed,
}: {
  initials: string;
  /** Stable seed for colour assignment — usually the review id or author. */
  seed: string;
}) {
  return (
    <div
      aria-hidden
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
      style={{
        backgroundColor: pickSwatch(seed),
        color: "var(--tavola-mozzarella)",
      }}
    >
      {initials}
    </div>
  );
}
