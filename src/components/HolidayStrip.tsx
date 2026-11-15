import { berlinToday, dayLabel, stripSummary, upcomingGroups } from "@/lib/holiday-hours";

/**
 * HolidayStrip — the thin version of the winter holiday hours, for /menu and
 * /wochenkarte (Founder 2026-11-15: the full tile stays on the homepage only).
 *
 * One line with what matters most; the full list of remaining days opens in
 * place on tap (native <details>, no client JavaScript). Same data as
 * WinterHoursBanner (`src/lib/holiday-hours.ts`), so nothing is kept twice.
 */
export function HolidayStrip({ previewDay }: { previewDay?: string } = {}) {
  const today = previewDay ?? berlinToday();
  const summary = stripSummary(today);
  if (!summary) return null;
  const days = upcomingGroups(today).flatMap((g) => g.days);

  return (
    <details
      className="group text-sm"
      style={{ backgroundColor: "#8E2800", color: "#FAFAFA" }}
      data-testid="holiday-strip"
    >
      <summary className="mx-auto flex max-w-6xl cursor-pointer list-none flex-wrap items-center justify-center gap-x-4 gap-y-1 px-6 py-2.5 text-center focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#FEF1A5] sm:px-12 [&::-webkit-details-marker]:hidden">
        <span>
          <strong className="font-semibold">Feiertage:</strong> {summary}
        </span>
        <span
          className="font-semibold underline underline-offset-4"
          style={{ color: "#FEF1A5" }}
        >
          <span className="group-open:hidden">Alle Zeiten anzeigen</span>
          <span className="hidden group-open:inline">Zeiten schließen</span>
        </span>
      </summary>
      <ul className="mx-auto max-w-md space-y-1.5 px-6 pb-5 pt-1 tabular-nums">
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
    </details>
  );
}
