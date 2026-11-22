import { periodOf, toIsoDate } from '@/utils/dateUtils';

/** The periods "Your order activity" can show. */
export const ACTIVITY_PERIODS = [
  { id: 'week', label: 'Last 7 days' },
  { id: 'month', label: 'Last 30 days' },
  { id: 'calendar', label: 'This month' },
];

// Shared with the owner's reports (utils/dateRangeUtils): kept importable from here for the customer dashboard
export { daysIn, previousRangeOf } from '@/utils/dateRangeUtils';

/** The period's first and last day ('YYYY-MM-DD', the customer's calendar, today included). */
export function rangeOf(period, today = new Date()) {
  if (period === 'week') {
    return periodOf(7, today);
  }
  if (period === 'month') {
    return periodOf(30, today);
  }
  return {
    fromDate: toIsoDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    toDate: toIsoDate(today),
  };
}
