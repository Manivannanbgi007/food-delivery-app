import { DISPLAY_LOCALE } from '@/utils/constants';
import { formatDate, parseIsoDate, toIsoDate } from '@/utils/dateUtils';

/**
 * Calendar arithmetic for the date picker. Days are local dates ('YYYY-MM-DD' strings at the edges), weeks start
 * on Monday (as ISO weeks and the revenue report do).
 */

export function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** The same day in another month, or that month's last day (31 Jan + 1 month -> 28/29 Feb). */
export function addMonths(date, months) {
  const firstOfTarget = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(firstOfTarget.getFullYear(), firstOfTarget.getMonth() + 1, 0).getDate();
  return new Date(
    firstOfTarget.getFullYear(),
    firstOfTarget.getMonth(),
    Math.min(date.getDate(), lastDay),
  );
}

/** Monday of the date's week. */
export function startOfWeek(date) {
  return addDays(date, -((date.getDay() + 6) % 7));
}

export function endOfWeek(date) {
  return addDays(startOfWeek(date), 6);
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** The 6 weeks shown for a month (always 42 days, so the calendar keeps its height). */
export function monthGrid(year, month) {
  const first = startOfWeek(new Date(year, month, 1));
  return Array.from({ length: 42 }, (_, index) => addDays(first, index));
}

/** Whether a day may be chosen: inside the optional limits ('YYYY-MM-DD', both included). */
export function isWithinLimits(date, min, max) {
  const iso = toIsoDate(date);
  return (!min || iso >= min) && (!max || iso <= max);
}

/** The closest day to `date` that may be chosen. */
export function clampToLimits(date, min, max) {
  const iso = toIsoDate(date);
  if (min && iso < min) {
    return parseIsoDate(min);
  }
  if (max && iso > max) {
    return parseIsoDate(max);
  }
  return date;
}

/** 'January' ... 'December' */
export const MONTH_NAMES = Array.from({ length: 12 }, (_, month) =>
  new Date(2026, month, 1).toLocaleDateString(DISPLAY_LOCALE, { month: 'long' }),
);

/** Monday first: [{ short: 'Mo', long: 'Monday' }, ...] */
export const WEEKDAYS = Array.from({ length: 7 }, (_, index) => {
  // 5 Oct 2026 is a Monday
  const day = new Date(2026, 9, 5 + index);
  const long = day.toLocaleDateString(DISPLAY_LOCALE, { weekday: 'long' });
  return { short: long.slice(0, 2), long };
});

/** '2026-10-08' -> 'Thursday, 8 October 2026' (what a screen reader says for a day button) */
export function longDate(date) {
  return date.toLocaleDateString(DISPLAY_LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/*
 * The admin Calendar page. Days are 'YYYY-MM-DD' strings in the business time zone (compared as text, which sorts
 * the same as the dates), weeks start on Sunday as in the design. Everything here is pure: no clock, no time zone
 * of the browser (the one clock reading takes the time zone it is given).
 */

/** Month view: one coupon bar row per week, two short events per day, then "+N more" */
export const MONTH_BAR_LANES = 1;
export const MONTH_PILLS_PER_DAY = 2;
/** Week view: coupon bar rows drawn before "+N more" */
export const WEEK_BAR_LANES = 3;

/** Sunday first: [{ short: 'Sun', long: 'Sunday' }, ...] */
export const SUNDAY_FIRST_WEEKDAYS = Array.from({ length: 7 }, (_, index) => {
  // 4 Oct 2026 is a Sunday
  const day = new Date(2026, 9, 4 + index);
  return {
    short: day.toLocaleDateString(DISPLAY_LOCALE, { weekday: 'short' }),
    long: day.toLocaleDateString(DISPLAY_LOCALE, { weekday: 'long' }),
  };
});

export function addIsoDays(isoDate, days) {
  return toIsoDate(addDays(parseIsoDate(isoDate), days));
}

/** 0 = Sunday ... 6 = Saturday */
export function weekdayOf(isoDate) {
  return parseIsoDate(isoDate).getDay();
}

export function isWeekend(isoDate) {
  const weekday = weekdayOf(isoDate);
  return weekday === 0 || weekday === 6;
}

/** The 7 days (Sunday to Saturday) of the week containing `isoDate`. */
export function weekDays(isoDate) {
  const sunday = addIsoDays(isoDate, -weekdayOf(isoDate));
  return Array.from({ length: 7 }, (_, index) => addIsoDays(sunday, index));
}

/** The 6 weeks shown for a month (month 0-11): 42 days from the Sunday on or before the 1st. */
export function monthGridWeeks(year, month) {
  const first = weekDays(toIsoDate(new Date(year, month, 1)))[0];
  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => addIsoDays(first, week * 7 + day)),
  );
}

/** The 6-week grid of the month containing `isoDate`. */
export function monthGridOf(isoDate) {
  const date = parseIsoDate(isoDate);
  return monthGridWeeks(date.getFullYear(), date.getMonth());
}

export function isInMonth(isoDate, year, month) {
  const date = parseIsoDate(isoDate);
  return date.getFullYear() === year && date.getMonth() === month;
}

/** The days the API is asked for to draw a view around `isoDate` (both included). */
export function visibleRange(view, isoDate) {
  switch (view) {
    case 'DATE':
      return { from: isoDate, to: isoDate };
    case 'WEEK': {
      const days = weekDays(isoDate);
      return { from: days[0], to: days[6] };
    }
    case 'MONTH': {
      const weeks = monthGridOf(isoDate);
      return { from: weeks[0][0], to: weeks[5][6] };
    }
    case 'YEAR': {
      const year = parseIsoDate(isoDate).getFullYear();
      return { from: `${year}-01-01`, to: `${year}-12-31` };
    }
  }
}

/** The date after going one step back (-1) or forward (1): a day, a week, a month or a year. */
export function shiftDate(view, isoDate, direction) {
  switch (view) {
    case 'DATE':
      return addIsoDays(isoDate, direction);
    case 'WEEK':
      return addIsoDays(isoDate, 7 * direction);
    case 'MONTH':
      return toIsoDate(addMonths(parseIsoDate(isoDate), direction));
    case 'YEAR':
      return toIsoDate(addMonths(parseIsoDate(isoDate), 12 * direction));
  }
}

/** Another month of the same year (or the same month of another year), keeping the day where it exists. */
export function withMonthYear(isoDate, year, month) {
  const day = parseIsoDate(isoDate).getDate();
  const lastDay = new Date(year, month + 1, 0).getDate();
  return toIsoDate(new Date(year, month, Math.min(day, lastDay)));
}

/** "Today" as a day in the given IANA time zone (an unknown zone falls back to this device's). */
export function todayInZone(timeZone, now = new Date()) {
  if (timeZone) {
    try {
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).formatToParts(now);
      const part = (type) => parts.find((entry) => entry.type === type)?.value ?? '';
      return `${part('year')}-${part('month')}-${part('day')}`;
    } catch {
      // An unknown time zone name: use the device's day below
    }
  }
  return toIsoDate(now);
}

/** The heading of a view: 'October 2026', '4 - 10 Oct 2026', '9 October 2026', '2026'. */
export function viewTitle(view, isoDate) {
  const date = parseIsoDate(isoDate);
  switch (view) {
    case 'MONTH':
      return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
    case 'YEAR':
      return String(date.getFullYear());
    case 'DATE':
      return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
    case 'WEEK': {
      const days = weekDays(isoDate);
      const first = parseIsoDate(days[0]);
      const last = parseIsoDate(days[6]);
      const short = (day) => day.toLocaleDateString(DISPLAY_LOCALE, { month: 'short' });
      if (first.getFullYear() !== last.getFullYear()) {
        return `${first.getDate()} ${short(first)} ${first.getFullYear()} - ${last.getDate()} ${short(last)} ${last.getFullYear()}`;
      }
      if (first.getMonth() !== last.getMonth()) {
        return `${first.getDate()} ${short(first)} - ${last.getDate()} ${short(last)} ${last.getFullYear()}`;
      }
      return `${first.getDate()} - ${last.getDate()} ${short(last)} ${last.getFullYear()}`;
    }
  }
}

/** '2026-10-09' -> '9 October 2026' */
export function fullDate(isoDate) {
  const date = parseIsoDate(isoDate);
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

/** What a screen reader says for a day: '9 October 2026, 3 events' */
export function dayLabel(isoDate, count) {
  const events = count === 0 ? 'no events' : count === 1 ? '1 event' : `${count} events`;
  return `${fullDate(isoDate)}, ${events}`;
}

const KIND_ORDER = {
  COUPON: 0,
  ORDERS_PLACED: 1,
  ORDERS_DELIVERED: 2,
  ORDERS_CANCELLED: 3,
  RESTAURANTS_REGISTERED: 4,
};

const compareEvents = (a, b) =>
  a.start.localeCompare(b.start) ||
  KIND_ORDER[a.kind] - KIND_ORDER[b.kind] ||
  a.id.localeCompare(b.id);

/** Only the events of the chosen types. */
export function filterEventsByType(events, types) {
  return events.filter((event) => types.has(event.type));
}

/** The part of an event inside the range (an event may start before or end after it); null when outside. */
export function clampToRange(event, from, to) {
  const start = event.start > from ? event.start : from;
  const end = event.end < to ? event.end : to;
  return start > end ? null : { start, end };
}

/** Events per day inside [from, to]: a multi-day event is listed on each of its days. Days without events are absent. */
export function indexEventsByDay(events, from, to) {
  const byDay = new Map();
  for (const event of [...events].sort(compareEvents)) {
    const clamped = clampToRange(event, from, to);
    if (!clamped) {
      continue;
    }
    for (let day = clamped.start; day <= clamped.end; day = addIsoDays(day, 1)) {
      const list = byDay.get(day);
      if (list) {
        list.push(event);
      } else {
        byDay.set(day, [event]);
      }
    }
  }
  return byDay;
}

/** How strongly a day is tinted in the year view: 0 (nothing), 1, 2 or 3. */
export function intensityLevel(count) {
  if (count <= 0) {
    return 0;
  }
  return count >= 6 ? 3 : count >= 3 ? 2 : 1;
}

/**
 * Places the events of one week row: coupon campaigns become bars across the days they cover (cut at the week's
 * edges, in the first row where they touch no other bar), the other events one-day pills in the rows under the bars.
 */
export function layoutWeek(
  week,
  events,
  { maxBarLanes = Number.POSITIVE_INFINITY, maxPills = Number.POSITIVE_INFINITY } = {},
) {
  const first = week[0];
  const last = week[week.length - 1];
  const inWeek = events.filter((event) => clampToRange(event, first, last));
  const clippedStart = (event) => (event.start > first ? event.start : first);

  // Bars: earlier start first, then the longer one, so long campaigns keep the top rows
  const candidates = inWeek
    .filter((event) => event.kind === 'COUPON')
    .sort(
      (a, b) =>
        clippedStart(a).localeCompare(clippedStart(b)) ||
        b.end.localeCompare(a.end) ||
        compareEvents(a, b),
    );
  const laneEnds = [];
  const placed = candidates.map((event) => {
    const startCol = week.indexOf(clippedStart(event));
    const endCol = week.indexOf(event.end < last ? event.end : last);
    let lane = laneEnds.findIndex((end) => end < startCol);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(endCol);
    } else {
      laneEnds[lane] = endCol;
    }
    return {
      event,
      lane,
      startCol,
      endCol,
      continuesBefore: event.start < first,
      continuesAfter: event.end > last,
    };
  });
  const bars = placed.filter((bar) => bar.lane < maxBarLanes);
  // The short events sit under the bars, in the same rows on every day of the week
  const barRows = Math.min(laneEnds.length, maxBarLanes);

  // Priority: orders placed, delivered, cancelled, then new restaurants
  const shortEvents = inWeek
    .filter((event) => event.kind !== 'COUPON')
    .sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.id.localeCompare(b.id));
  const days = week.map((date, column) => {
    const covering = placed.filter((bar) => bar.startCol <= column && column <= bar.endCol);
    const dayEvents = shortEvents.filter((event) => event.start <= date && date <= event.end);
    const pills = dayEvents
      .slice(0, maxPills)
      .map((event, index) => ({ event, lane: barRows + index }));
    const hiddenBars = covering.filter((bar) => bar.lane >= maxBarLanes).length;
    return {
      date,
      pills,
      moreLane: barRows + pills.length,
      hiddenCount: hiddenBars + (dayEvents.length - pills.length),
      total: covering.length + dayEvents.length,
    };
  });

  const laneCount = Math.max(
    0,
    ...bars.map((bar) => bar.lane + 1),
    ...days.map((day) => barRows + day.pills.length),
  );
  /** The row of the "+N more" pill (after the pills) */
  const moreRow = barRows + (Number.isFinite(maxPills) ? maxPills : 0);
  return { bars, days, laneCount, moreRow };
}

export const EVENT_TYPE_LABELS = {
  ORDERS: 'Orders',
  COUPONS: 'Coupons',
  RESTAURANTS: 'Restaurants',
};

/** What an event says on its pill: its title ('181 orders', '37 delivered', a coupon's code). */
export function pillText(event) {
  return event.title;
}

/** A coupon's status as words: 'ACTIVE' -> 'Active'. */
export function statusLabel(status) {
  return status.charAt(0) + status.slice(1).toLowerCase().replaceAll('_', ' ');
}

/** The full text of an event (tooltips, screen readers): 'Coupon SAVE20: 9 Oct 2026 to 15 Oct 2026, Active, used 12 times'. */
export function describeEvent(event) {
  if (event.kind !== 'COUPON') {
    return pillText(event);
  }
  const parts = [
    event.start === event.end
      ? formatDate(event.start)
      : `${formatDate(event.start)} to ${formatDate(event.end)}`,
  ];
  if (event.status) {
    parts.push(statusLabel(event.status));
  }
  if (event.count !== null) {
    parts.push(event.count === 1 ? 'used once' : `used ${event.count} times`);
  }
  return `Coupon ${event.title}: ${parts.join(', ')}`;
}
