/**
 * SundayBanner — temporary announcement strip for the Sunday opening hours.
 *
 * 2026-07-26: RENAMED from SundayLunchBanner and rewritten. Sunday is no longer
 * a separate lunch service inside a closed afternoon — the kitchen now runs
 * CONTINUOUSLY from 12:00 to 22:30. "Mittagstisch" stopped being true, and a
 * component called …LunchBanner announcing something that is not lunch is the
 * same class of stale label as the copy it renders.
 *
 * Placement: top of the homepage AND /empfehlungen, directly under the header
 * and ABOVE the cream DeliveryBanner.
 *
 * Design: white field, near-black text, RED key words ("jeden Sonntag",
 * the time window) for maximum prominence. The earlier marinara-on-marinara
 * version blended into the page's red palette and got lost — a white strip
 * between the dark header and the cream delivery banner pops instead.
 * Colours are hardcoded (mode-independent): the banner stays white in dark
 * mode too, so the announcement always stands out.
 *
 * AUTO-EXPIRY: the banner shows through the end of Sunday 2 August 2026
 * (Europe/Berlin) and then hides itself — no manual removal or redeploy
 * needed. The home page is ISR (`export const revalidate` in app/page.tsx),
 * so on the first regeneration after the cutoff the date check below returns
 * null and the strip disappears. To extend it, bump BANNER_EXPIRES_AT.
 *
 * Copy variant: V3 — "Herzlich & italienisch".
 */

/**
 * Cutoff: end of Sunday 2 August 2026 in Europe/Berlin (CEST = UTC+2), i.e.
 * midnight into Monday 3 August. A fixed timestamp.
 *
 * Chosen deliberately, not rounded: Sunday 2 August is the last service before
 * the summer closure, and the banner announces Sunday hours. From Monday
 * 3 August the restaurant is shut for holidays, so a strip advertising Sunday
 * opening would be actively wrong — it retires on exactly the right day.
 */
const BANNER_EXPIRES_AT = new Date("2026-08-03T00:00:00+02:00").getTime();

/**
 * Reading the clock lives here, outside the component body, so the Server
 * Component stays pure (react-hooks/purity). The result is decided at build /
 * ISR-regeneration time — the home page sets `revalidate` — and is never
 * re-evaluated on the client.
 */
function bannerHasExpired(): boolean {
  return Date.now() >= BANNER_EXPIRES_AT;
}

/**
 * MASTER TOGGLE. Set to `false` to hide the banner immediately — independent of
 * the auto-expiry above — for when the Sunday-lunch launch date shifts.
 * Flip back to `true` to show it again (the BANNER_EXPIRES_AT cutoff still
 * applies on top, so bump that date too if the new launch is after 2 Aug 2026).
 *
 * 2026-06-13: DISABLED — the Sunday-lunch start was being postponed, so the
 * announcement was hidden until the date firmed up.
 * 2026-06-20: RE-ENABLED — Silvio confirmed Sunday lunch is live now
 * (12:00–14:30, owner-changed from the earlier 11:30 start).
 * 2026-07-26: Sunday became CONTINUOUS 12:00–22:30; copy rewritten, expiry
 * moved to 3 August so the strip covers the last Sunday before the closure.
 */
const BANNER_ENABLED = true;

export function SundayBanner() {
  if (!BANNER_ENABLED || bannerHasExpired()) return null;

  return (
    <section
      style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #EAE0C5" }}
      aria-label="Aktuelle Ankündigung"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-3 text-center sm:flex-row sm:justify-center sm:gap-4 sm:px-12">
        <span
          className="inline-flex flex-shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
          style={{ backgroundColor: "#8E2800", color: "#FFFFFF" }}
        >
          Neu &middot; Sonntags
        </span>
        <p className="text-sm sm:text-base" style={{ color: "#1A1612" }}>
          <span
            className="font-display text-base italic sm:text-lg"
            style={{ color: "#8E2800" }}
          >
            Buona domenica!
          </span>
          <br />
          Ab sofort kochen wir{" "}
          <strong style={{ color: "#8E2800" }}>jeden Sonntag</strong>{" "}
          durchgehend von{" "}
          <strong style={{ color: "#8E2800" }}>12:00 bis 22:30 Uhr</strong>.{" "}
          Ob nach dem Kirchgang oder dem Spaziergang &mdash; bei uns wartet ein
          gedeckter Tisch auf Sie und Ihre Familie.
        </p>
      </div>
    </section>
  );
}
