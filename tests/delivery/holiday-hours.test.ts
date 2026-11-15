import assert from "node:assert/strict";
import {
  BANNER_HIDDEN_FROM,
  HOLIDAY_DAYS,
  REGULAR_FROM,
  berlinToday,
  dayLabel,
  isHolidayBannerWindow,
  longLabel,
  shortLabel,
  stripSummary,
  upcomingGroups,
} from "../../src/lib/holiday-hours";

/**
 * The winter holiday banner (Founder 2026-11-15, variant B). The 2026 summer
 * banner reached review with a hand-written weekday that was wrong, so these
 * checks pin the DERIVED weekdays against the calendar and the date window
 * against concrete days, instead of trusting the ISO strings.
 */

let checks = 0;
function check(name: string, fn: () => void): void {
  fn();
  checks++;
  console.log(`ok - ${name}`);
}

check("weekdays are derived correctly", () => {
  assert.equal(shortLabel("2026-12-01"), "Di 1.12.");
  assert.equal(shortLabel("2026-12-24"), "Do 24.12.");
  assert.equal(shortLabel("2026-12-28"), "Mo 28.12.");
  assert.equal(shortLabel("2027-01-06"), "Mi 6.1.");
  assert.equal(shortLabel("2027-01-10"), "So 10.1.");
});

check("every December-group day is a Tuesday", () => {
  for (const d of HOLIDAY_DAYS.filter((x) => x.group === "december")) {
    assert.ok(shortLabel(d.date).startsWith("Di "), d.date);
  }
});

check("the rest-day range reads as one row", () => {
  const row = HOLIDAY_DAYS.find((d) => d.until);
  assert.ok(row);
  assert.equal(dayLabel(row), "Mo 4. + Di 5.1.");
  assert.equal(row.time, null);
});

check("closed days are exactly 24, 25, 31 Dec, 1 Jan and the 4–5 Jan rest days", () => {
  const closed = HOLIDAY_DAYS.filter((d) => d.time === null).map((d) => d.date);
  assert.deepEqual(closed, ["2026-12-24", "2026-12-25", "2026-12-31", "2027-01-01", "2027-01-04"]);
});

check("days are in calendar order without duplicates", () => {
  const dates = HOLIDAY_DAYS.map((d) => d.date);
  assert.deepEqual([...dates].sort(), dates);
  assert.equal(new Set(dates).size, dates.length);
});

check("regular week resumes on a Wednesday", () => {
  assert.equal(longLabel(REGULAR_FROM), "Mittwoch, 13. Januar");
  assert.equal(shortLabel(BANNER_HIDDEN_FROM), "Mo 11.1.");
});

check("window: visible now and on 10 Jan, hidden from 11 Jan", () => {
  assert.equal(isHolidayBannerWindow("2026-11-15"), true);
  assert.equal(isHolidayBannerWindow("2027-01-10"), true);
  assert.equal(isHolidayBannerWindow("2027-01-11"), false);
});

check("past days drop out and emptied groups disappear", () => {
  assert.equal(upcomingGroups("2026-11-20").length, 3);
  const dec27 = upcomingGroups("2026-12-27");
  assert.deepEqual(dec27.map((g) => g.group.id), ["christmas", "january"]);
  assert.equal(dec27[0].days[0].date, "2026-12-27");
  const jan4 = upcomingGroups("2027-01-04");
  assert.deepEqual(jan4.map((g) => g.group.id), ["january"]);
  assert.equal(jan4[0].days[0].date, "2027-01-04");
  // The range row stays visible on its second day.
  assert.equal(upcomingGroups("2027-01-05")[0].days[0].date, "2027-01-04");
  assert.equal(upcomingGroups("2027-01-11").length, 0);
});

check("Berlin day, not UTC: 23:30 UTC on 10 Jan is already 11 Jan in Berlin", () => {
  assert.equal(berlinToday(new Date("2027-01-10T23:30:00Z")), "2027-01-11");
  assert.equal(berlinToday(new Date("2027-01-10T22:30:00Z")), "2027-01-10");
});

check("strip summary only announces what is still ahead", () => {
  assert.equal(stripSummary("2026-11-15"), "24.–25.12. und 31.12.–1.1. geschlossen · im Dezember auch dienstags geöffnet");
  assert.equal(stripSummary("2026-12-26"), "31.12.–1.1. geschlossen · im Dezember auch dienstags geöffnet");
  assert.equal(stripSummary("2026-12-30"), "31.12.–1.1. geschlossen");
  assert.equal(stripSummary("2027-01-02"), "4.–5.1. Ruhetage, 6.1. geöffnet");
  assert.equal(stripSummary("2027-01-11"), null);
});

console.log(`\n${checks} checks passed`);
console.log(`${checks} passed, 0 failed`);
