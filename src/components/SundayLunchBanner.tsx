/**
 * SundayLunchBanner — temporary announcement strip for the new Sunday
 * lunch service (Sundays 11:30–14:30, starting 14 June 2026).
 *
 * Placement: top of the homepage, directly under the header and ABOVE the
 * cream DeliveryBanner. Rendered on a deep Marinara field with light text so
 * it stands apart from the cream delivery strip beneath it (two cream strips
 * would visually merge) and reads as "news".
 *
 * TEMPORARY: runs ~4 weeks. Remove (or move to the next announcement) after
 * approx. 12 July 2026 unless the owner extends it.
 *
 * Copy variant: V3 — "Herzlich & italienisch".
 */
export function SundayLunchBanner() {
  return (
    <section
      style={{ backgroundColor: "var(--color-bg-marinara)" }}
      aria-label="Aktuelle Ankündigung"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-3 text-center sm:flex-row sm:justify-center sm:gap-3 sm:px-12">
        <span
          className="inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide"
          style={{
            backgroundColor: "var(--color-on-marinara-muted)",
            color: "var(--color-bg-marinara)",
          }}
        >
          Neu
        </span>
        <p
          className="text-sm sm:text-base"
          style={{ color: "var(--color-on-marinara)" }}
        >
          <strong className="font-medium">
            Buon pranzo della domenica!
          </strong>{" "}
          Ab dem 14. Juni kochen wir jeden Sonntag zusätzlich von 11:30 bis
          14:30 Uhr. Ob nach dem Kirchgang oder dem Spaziergang &mdash; bei uns
          wartet ein gedeckter Tisch auf Sie und Ihre Familie.
        </p>
      </div>
    </section>
  );
}
