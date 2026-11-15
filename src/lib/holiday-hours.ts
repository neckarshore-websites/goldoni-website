/**
 * Winter holiday hours 2026/27 — the data behind WinterHoursBanner.
 *
 * Source: the owner's special-hours list, passed on by the Founder on
 * 2026-11-15 (screenshot in Linus' session). Founder answers the same day:
 * Mon 4 and Tue 5 January are ordinary rest days; the banner is visible
 * immediately; the Wolt button stays as it is (the owner sets holiday hours
 * at Wolt himself).
 *
 * OPEN at the time of writing: Sundays 27 Dec, 3 Jan and 10 Jan are listed
 * with 18:00–22:30 only, while a normal Sunday opens at 12:00. The question
 * went to the owner. The banner shows the list as given; change the three
 * `time` values below if the answer differs.
 *
 * Only DEVIATIONS from the regular week (SITE.hours) are listed, plus the
 * public holidays guests ask about even when nothing changes (26 Dec, 6 Jan).
 *
 * Dates are ISO strings; the weekday is DERIVED, never written next to the
 * date. The summer banner of 2026 had a weekday written by hand that was
 * wrong (a Monday labelled Wednesday) — derivation makes that impossible.
 */

export type HolidayGroupId = "december" | "christmas" | "january";

export type HolidayDay = {
  /** ISO date (Europe/Berlin calendar day). */
  date: string;
  group: HolidayGroupId;
  /** Name of the holiday, if the day is one. */
  holiday?: string;
  /** "HH:MM–HH:MM", or null when closed. */
  time: string | null;
  /**
   * Optional last day for a closed range shown as one row
   * (e.g. the two rest days 4–5 January).
   */
  until?: string;
};

export type HolidayGroup = {
  id: HolidayGroupId;
  title: string;
  intro?: string;
};

export const HOLIDAY_GROUPS: HolidayGroup[] = [
  {
    id: "december",
    title: "Im Dezember",
    intro: "Zusätzlich dienstags ab 18:00 geöffnet.",
  },
  { id: "christmas", title: "Weihnachten & Silvester" },
  { id: "january", title: "Erste Januarwoche" },
];

const EVENING = "18:00–22:30";

export const HOLIDAY_DAYS: HolidayDay[] = [
  { date: "2026-12-01", group: "december", time: EVENING },
  { date: "2026-12-08", group: "december", time: EVENING },
  { date: "2026-12-15", group: "december", time: EVENING },
  { date: "2026-12-22", group: "december", time: EVENING },
  { date: "2026-12-24", group: "christmas", holiday: "Heiligabend", time: null },
  { date: "2026-12-25", group: "christmas", holiday: "1. Weihnachtstag", time: null },
  { date: "2026-12-26", group: "christmas", holiday: "2. Weihnachtstag", time: EVENING },
  { date: "2026-12-27", group: "christmas", time: EVENING },
  { date: "2026-12-28", group: "christmas", time: EVENING },
  { date: "2026-12-29", group: "christmas", time: EVENING },
  { date: "2026-12-31", group: "christmas", holiday: "Silvester", time: null },
  { date: "2027-01-01", group: "christmas", holiday: "Neujahr", time: null },
  { date: "2027-01-03", group: "january", time: EVENING },
  { date: "2027-01-04", group: "january", holiday: "Ruhetage", time: null, until: "2027-01-05" },
  { date: "2027-01-06", group: "january", holiday: "Heilige Drei Könige", time: EVENING },
  { date: "2027-01-10", group: "january", time: EVENING },
];

/** First day back on the regular week (Wed 13 Jan; Mon/Tue 11–12 are rest days). */
export const REGULAR_FROM = "2027-01-13";

/** The banner hides from this Berlin calendar day on (Mon 11 Jan 2027). */
export const BANNER_HIDDEN_FROM = "2027-01-11";

/** Master switch: false hides the banner everywhere except /sandbox. */
export const BANNER_ENABLED = true;

const WEEKDAYS_SHORT = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const WEEKDAYS_LONG = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  // UTC so the server's time zone cannot shift the weekday.
  const weekday = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
  return { y, m, d, weekday };
}

/** "2026-12-24" -> "Do 24.12." */
export function shortLabel(iso: string): string {
  const { m, d, weekday } = parts(iso);
  return `${WEEKDAYS_SHORT[weekday]} ${d}.${m}.`;
}

/** Row label, a range for `until` rows: "Mo 4. + Di 5.1." */
export function dayLabel(day: HolidayDay): string {
  if (!day.until) return shortLabel(day.date);
  const a = parts(day.date);
  const b = parts(day.until);
  return `${WEEKDAYS_SHORT[a.weekday]} ${a.d}. + ${WEEKDAYS_SHORT[b.weekday]} ${b.d}.${b.m}.`;
}

/** "2027-01-13" -> "Mittwoch, 13. Januar" */
export function longLabel(iso: string): string {
  const { m, d, weekday } = parts(iso);
  return `${WEEKDAYS_LONG[weekday]}, ${d}. ${MONTHS[m - 1]}`;
}

/** Today's calendar day in Europe/Berlin as ISO "YYYY-MM-DD". */
export function berlinToday(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Whether the banner shows on the given Berlin day. Visible from now on (Founder 2026-11-15). */
export function isHolidayBannerWindow(today: string): boolean {
  return today < BANNER_HIDDEN_FROM;
}

/**
 * Groups with the rows still ahead of `today` (today included). Past days
 * drop out and an emptied group disappears, so the banner shortens week by week.
 */
export function upcomingGroups(today: string): { group: HolidayGroup; days: HolidayDay[] }[] {
  return HOLIDAY_GROUPS.map((group) => ({
    group,
    days: HOLIDAY_DAYS.filter((d) => d.group === group.id && (d.until ?? d.date) >= today),
  })).filter((g) => g.days.length > 0);
}
