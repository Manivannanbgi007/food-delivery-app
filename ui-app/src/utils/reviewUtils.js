import { DISPLAY_LOCALE } from '@/utils/constants';
import { formatDate, periodOf } from '@/utils/dateUtils';

/** The periods of "Filter Period": the last days, everything, or two days of the admin's choice. */
export const REVIEW_PERIODS = ['7', '30', '90', 'all', 'custom'];

export const REVIEW_PERIOD_LABELS = {
  7: 'Last 7 days',
  30: 'Last 30 days',
  90: 'Last 90 days',
  all: 'All time',
  custom: 'Custom range',
};

/** The from / to days the API is asked with (none for "All time", or while a custom range is incomplete). */
export function periodScope(period, today = new Date()) {
  switch (period.kind) {
    case 'all':
      return {};
    case 'custom':
      return {
        ...(period.from ? { from: period.from } : {}),
        ...(period.to ? { to: period.to } : {}),
      };
    default: {
      const { fromDate, toDate } = periodOf(Number(period.kind), today);
      return { from: fromDate, to: toDate };
    }
  }
}

/** '17 Apr 2020 - 21 May 2020', 'All time', or what is known of a custom range. */
export function describePeriod(scope) {
  if (scope.from && scope.to) {
    return `${formatDate(scope.from)} - ${formatDate(scope.to)}`;
  }
  if (scope.from) {
    return `From ${formatDate(scope.from)}`;
  }
  if (scope.to) {
    return `Until ${formatDate(scope.to)}`;
  }
  return 'All time';
}

/** Blue for what is about service, green for praise of the food, orange for the rest. */
export function tagTone(tag) {
  switch (tag) {
    case 'GOOD_SERVICE':
    case 'FAST_DELIVERY':
      return 'service';
    case 'DELICIOUS':
    case 'EXCELLENT':
      return 'praise';
    default:
      return 'other';
  }
}

/** Soft backgrounds with readable text of the same colour, from the theme's tokens (light and dark). */
export const AVATAR_TONES = [
  'bg-brand-100 text-brand-text-strong',
  'bg-info-100 text-info-ink',
  'bg-warning-100 text-warning-ink',
  'bg-danger-100 text-danger-ink',
  'bg-sunset-50 text-sunset-text',
];

/** The same name always gets the same colour. */
export function avatarTone(name) {
  let hash = 0;
  for (const character of name) {
    hash = (hash * 31 + character.codePointAt(0)) >>> 0;
  }
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}

/** '2020-06-24T10:15:00Z' -> '24 June 2020' (in the viewer's time zone) */
export function formatReviewDate(isoInstant) {
  return new Date(isoInstant).toLocaleDateString(DISPLAY_LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
