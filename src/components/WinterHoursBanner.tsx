import {
  BANNER_ENABLED,
  REGULAR_FROM,
  berlinToday,
  dayLabel,
  isHolidayBannerWindow,
  longLabel,
  upcomingGroups,
} from "@/lib/holiday-hours";

/**
 * WinterHoursBanner — special opening hours over Christmas and New Year 2026/27.
 *
 * Variant B of the draft artifact, chosen by the Founder on 2026-11-15: one
 * tile, three blocks (December Tuesdays, Christmas & New Year's Eve, first
 * week of January). Data and date logic live in `src/lib/holiday-hours.ts`.
 *
 * Shows only what deviates from the regular week, and only days still ahead:
 * the page regenerates every 6 hours (`revalidate` on the pages that use it),
 * so a past day drops out within that window and the tile disappears on
 * Monday, 11 January 2027.
 *
 * Colour: marinara, the deep red of the Tavola palette, with mozzarella text
 * and parmigiano accents — the same pairs the site already uses on
 * `--color-bg-marinara`, so no new contrast pair is introduced.
 */
export function WinterHoursBanner({
  forcePreview = false,
  previewDay,
}: {
  /** Bypasses the switch and the date window — for /sandbox only. */
  forcePreview?: boolean;
  /** Pretend "today" for the preview (ISO date). */
  previewDay?: string;
} = {}) {
  const today = previewDay ?? berlinToday();
  if (!forcePreview && (!BANNER_ENABLED || !isHolidayBannerWindow(today))) {
    return null;
  }

  const groups = upcomingGroups(today);
  if (groups.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#8E2800",
        background: "linear-gradient(120deg, #6E1F00 0%, #8E2800 55%, #9A3410 100%)",
      }}
      aria-labelledby="winter-hours-title"
      data-testid="winter-hours-banner"
    >
      <div className="relative mx-auto max-w-6xl px-6 py-10 text-center sm:px-12 sm:py-12">
        <p className="font-display text-lg italic sm:text-xl" style={{ color: "#FEF1A5" }}>
          Buone Feste!
        </p>
        <h2
          id="winter-hours-title"
          className="mt-2 text-2xl font-bold sm:text-3xl"
          style={{ color: "#FAFAFA" }}
        >
          Unsere Zeiten über die Feiertage
        </h2>

        <div
          className={`mx-auto mt-6 grid max-w-4xl gap-4 text-left ${
            groups.length === 3 ? "md:grid-cols-3" : groups.length === 2 ? "md:grid-cols-2" : ""
          }`}
        >
          {groups.map(({ group, days }) => (
            <div
              key={group.id}
              className="min-w-0 rounded-lg p-4"
              style={{
                backgroundColor: "rgba(26, 22, 18, 0.28)",
                border: "1px solid rgba(254, 241, 165, 0.22)",
              }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#FEF1A5" }}
              >
                {group.title}
              </h3>
              {group.intro ? (
                <p className="mt-2 text-sm" style={{ color: "#FAFAFA" }}>
                  {group.intro}
                </p>
              ) : null}
              <ul className="mt-3 space-y-1.5 text-sm tabular-nums" style={{ color: "#FAFAFA" }}>
                {days.map((day) => (
                  <li
                    key={day.date}
                    className="flex justify-between gap-3 border-b border-dashed border-[#FEF1A5]/20 pb-1.5 last:border-b-0 last:pb-0"
                  >
                    <span className="whitespace-nowrap">
                      {dayLabel(day)}
                      {day.holiday ? (
                        <span className="block text-xs" style={{ opacity: 0.85 }}>
                          {day.holiday}
                        </span>
                      ) : null}
                    </span>
                    {day.time ? (
                      <span className="whitespace-nowrap text-right">{day.time}</span>
                    ) : (
                      <span className="whitespace-nowrap text-right font-semibold" style={{ color: "#FEF1A5" }}>
                        geschlossen
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p
          className="mt-6 inline-block rounded-full px-5 py-2 text-sm font-semibold sm:text-base"
          style={{ backgroundColor: "#FEF1A5", color: "#1A1612" }}
        >
          Ab {longLabel(REGULAR_FROM)} wieder zu den gewohnten Zeiten
        </p>
      </div>
    </section>
  );
}
