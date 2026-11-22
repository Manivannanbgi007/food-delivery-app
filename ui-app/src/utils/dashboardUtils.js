import { ORDER_STATUSES } from '@/types/order';
import { ORDER_STATUS_LABELS } from '@/utils/constants';
import { shortMonthName } from '@/utils/dateUtils';

/** The dashboard's calculations, kept out of the components so they are easy to test and to reuse. */

/** Adds up the period's days (the four cards at the top). */
export function sumOrdersPerDay(days) {
  return days.reduce(
    (totals, day) => ({
      orders: totals.orders + day.orders,
      delivered: totals.delivered + day.completed,
      cancelled: totals.cancelled + day.cancelled,
      revenue: totals.revenue + day.revenue,
    }),
    { orders: 0, delivered: 0, cancelled: 0, revenue: 0 },
  );
}

/** part of whole in percent; null when there is nothing to compare with (no division by zero). */
export function percentOf(part, whole) {
  return whole > 0 ? (part / whole) * 100 : null;
}

export function dashboardFigures(dashboard) {
  return orderFigures(
    dashboard.charts.ordersPerDay,
    dashboard.charts.paymentOutcome,
    dashboard.unavailable,
  );
}

/** The same figures for one chosen day, week or month (the order-activity answer). */
export function activityFigures(activity) {
  return orderFigures(activity.ordersPerDay, activity.paymentOutcome, activity.unavailable);
}

/** The figures of any list of days with its online payments (the dashboard, a chosen range). */
export function orderFigures(ordersPerDay, payments, unavailable) {
  const ordersKnown = !unavailable.includes('order-service');
  const totals = ordersKnown ? sumOrdersPerDay(ordersPerDay) : null;

  return {
    totals,
    deliveredRate: totals ? percentOf(totals.delivered, totals.orders) : null,
    cancelledRate: totals ? percentOf(totals.cancelled, totals.orders) : null,
    paymentSuccessRate: payments
      ? percentOf(payments.successful, payments.successful + payments.failed)
      : null,
  };
}

/** The orders-by-status chart: statuses in the order an order moves through them, unknown ones last. */
export function ordersByStatusBars(ordersByStatus) {
  const known = ORDER_STATUSES.filter((status) => status in ordersByStatus).map((status) => ({
    status,
    label: ORDER_STATUS_LABELS[status],
    count: ordersByStatus[status],
  }));
  const unknown = Object.keys(ordersByStatus)
    .filter((status) => !ORDER_STATUSES.includes(status))
    .map((status) => ({ status, label: status, count: ordersByStatus[status] }));
  return [...known, ...unknown];
}

/**
 * Twelve months, January to December, with this year's and last year's revenue. Months of this year that have
 * not come yet are null (the line stops there instead of dropping to zero).
 */
export function monthlyRevenueSeries(thisYear, lastYear) {
  const byMonth = (periods) =>
    new Map(periods.map((period) => [monthIndexOf(period.label), period.revenue]));
  const thisYearByMonth = byMonth(thisYear);
  const lastYearByMonth = byMonth(lastYear);

  return Array.from({ length: 12 }, (_, monthIndex) => ({
    month: shortMonthName(monthIndex),
    thisYear: thisYearByMonth.get(monthIndex) ?? null,
    lastYear: lastYearByMonth.get(monthIndex) ?? null,
  }));
}

/** '2026-10' -> 9 (October) */
function monthIndexOf(label) {
  return Number(label.slice(5, 7)) - 1;
}

/** A restaurant's cancellation rate (percent): few cancellations are good news, many a warning sign. */
export function cancellationTone(rate) {
  if (rate < 10) {
    return 'success';
  }
  return rate < 25 ? 'warning' : 'danger';
}
