import { CHART_COLORS } from '@/utils/chartColors';

/**
 * The orders-and-sales chart's figures, shared by the admin and the restaurant owner dashboards: each day (or each
 * hour of one day) of the API (orders placed, delivered, cancelled or rejected, and the delivered orders' value)
 * and how each one is drawn.
 */

const withInProgress = (point) => ({
  ...point,
  inProgress: Math.max(0, point.orders - point.completed - point.cancelled),
});

export function salesDaysOf(days) {
  return days.map(withInProgress);
}

export function salesHoursOf(hours) {
  return hours.map(withInProgress);
}

/** The day (or hour) with the most orders (the first one on a tie); undefined when none had an order. */
export function busiestDayOf(points) {
  return points.reduce(
    (best, point) => (point.orders > (best?.orders ?? 0) ? point : best),
    undefined,
  );
}

/** Sales: a sky-blue area with a smooth line and dots, as in the design reference. */
export const SALES_LINE = {
  key: 'revenue',
  label: 'Sales',
  color: '#0ea5e9',
  to: '#7dd3fc',
};

/** Orders: bars stacked bottom to top, each part a gradient from its colour (top) to a deeper one. */
export const ORDER_BARS = [
  { key: 'completed', label: 'Delivered', color: CHART_COLORS.brand, to: CHART_COLORS.deepGreen },
  { key: 'inProgress', label: 'In progress', color: '#a78bfa', to: CHART_COLORS.violet },
  {
    key: 'cancelled',
    label: 'Cancelled or rejected',
    color: CHART_COLORS.danger,
    to: CHART_COLORS.rose,
  },
];

/** A single day's report: a header, then one row per hour ('13:00' = 1 pm to 2 pm). */
export function salesHourReportRows(hours) {
  return [
    ['Hour', 'Orders', 'Delivered', 'In progress', 'Cancelled or rejected', 'Sales (delivered)'],
    ...hours.map((hour) => [
      `${String(hour.hour).padStart(2, '0')}:00`,
      hour.orders,
      hour.completed,
      hour.inProgress,
      hour.cancelled,
      hour.revenue,
    ]),
  ];
}

/** The report's rows (a header, then one row per day), as "Save Report" downloads them. */
export function salesReportRows(days) {
  return [
    ['Date', 'Orders', 'Delivered', 'In progress', 'Cancelled or rejected', 'Sales (delivered)'],
    ...days.map((day) => [
      day.date,
      day.orders,
      day.completed,
      day.inProgress,
      day.cancelled,
      day.revenue,
    ]),
  ];
}
