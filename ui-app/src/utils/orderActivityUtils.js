import { addDays, addMonths, endOfWeek, startOfWeek } from '@/utils/calendarUtils';
import { DASHBOARD_PERIOD_OPTIONS, DISPLAY_LOCALE } from '@/utils/constants';
import { formatDate, parseIsoDate, toIsoDate } from '@/utils/dateUtils';

/**
 * The ranges of the dashboard's "Order & Sales Overview": the last 7, 30 or 90 days, or one calendar day, week or
 * month; which days a choice covers, how to step to the previous or next one, and how to name it. Days are
 * 'YYYY-MM-DD' in the business time zone; "today" always comes from the server (the dashboard's `today`), never from
 * the browser's clock.
 */

export const ROLLING_CHOICES = DASHBOARD_PERIOD_OPTIONS.map((days) => ({
  mode: rollingModeOf(days),
  days,
}));

export function rollingModeOf(days) {
  return `last${days}`;
}

/** How many days a rolling choice covers; null for a calendar day, week or month. */
export function rollingDaysOf(mode) {
  return ROLLING_CHOICES.find((choice) => choice.mode === mode)?.days ?? null;
}

/** The `days` days that end today, both included. */
export function rollingRange(days, today) {
  return { fromDate: toIsoDate(addDays(parseIsoDate(today), -(days - 1))), toDate: today };
}

export const ACTIVITY_UNIT_LABELS = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
};

const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const lastDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

/** The first and last day of the unit around `anchor`, as a whole (a week is Monday to Sunday). */
function wholeUnit(unit, anchor) {
  switch (unit) {
    case 'day':
      return { from: anchor, to: anchor };
    case 'week':
      return { from: startOfWeek(anchor), to: endOfWeek(anchor) };
    case 'month':
      return { from: firstDayOfMonth(anchor), to: lastDayOfMonth(anchor) };
  }
}

/** A day that has not come yet is never asked for: the running week or month ends today. */
export function activityRange(unit, anchor, today) {
  const { from, to } = wholeUnit(unit, parseIsoDate(anchor));
  const last = toIsoDate(to) > today ? today : toIsoDate(to);
  return { fromDate: toIsoDate(from), toDate: last };
}

/** The chosen day, kept inside the days that exist (never after today). */
export function clampToToday(anchor, today) {
  return anchor > today ? today : anchor;
}

/** Moves one day, week or month back (-1) or forward (+1). */
export function shiftAnchor(unit, anchor, step, today) {
  const date = parseIsoDate(anchor);
  const moved =
    unit === 'day'
      ? addDays(date, step)
      : unit === 'week'
        ? addDays(date, 7 * step)
        : addMonths(date, step);
  return clampToToday(toIsoDate(moved), today);
}

/** Whether a later day, week or month has started (a future one has no orders to show). */
export function canGoForward(unit, anchor, today) {
  const { to } = wholeUnit(unit, parseIsoDate(anchor));
  return toIsoDate(to) < today;
}

/** "8 Oct 2026", "5 Oct 2026 - 11 Oct 2026" or "October 2026": how the choice is named on the dashboard. */
export function activityLabel(unit, range) {
  if (unit === 'day') {
    return formatDate(range.fromDate);
  }
  if (unit === 'month') {
    return parseIsoDate(range.fromDate).toLocaleDateString(DISPLAY_LOCALE, {
      month: 'long',
      year: 'numeric',
    });
  }
  return `${formatDate(range.fromDate)} - ${formatDate(range.toDate)}`;
}
