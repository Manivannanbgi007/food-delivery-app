import { presetIdOf, presetLabel, presetRange, rangeProblem } from '@/utils/dateRangeUtils';
import { toIsoDate } from '@/utils/dateUtils';

/** The overview's days when the address names none. */
export const DEFAULT_SALES_PRESET = '7';

/**
 * The days the overview shows, from the address: `?range=30` (a ready-made range: a shared link keeps meaning "the
 * last 30 days") or `?from=2026-10-01&to=2026-10-07` (days picked in the calendar; one day when both are the
 * same). Nothing: the last 7 days. Days that cannot be used (an old or edited link) are not asked for: the reason
 * is returned and the last 7 days are shown instead.
 */
export function salesFilterOf(params, today = new Date()) {
  const fallback = {
    range: presetRange(DEFAULT_SALES_PRESET, today),
    preset: DEFAULT_SALES_PRESET,
  };
  if (params.from !== undefined || params.to !== undefined) {
    const range = { fromDate: params.from, toDate: params.to };
    const problem = rangeProblem(range, toIsoDate(today));
    return problem ? { ...fallback, problem } : { range: range };
  }
  if (params.range === undefined) {
    return fallback;
  }
  const preset = presetIdOf(params.range);
  return preset
    ? { range: presetRange(preset, today), preset }
    : { ...fallback, problem: `"${params.range}" is not a range this page knows.` };
}

/**
 * The address for a choice of the date range picker: a ready-made range by its name (none for the default), days
 * picked in the calendar by their dates.
 */
export function salesFilterParams(range, preset) {
  if (preset) {
    return { range: preset === DEFAULT_SALES_PRESET ? undefined : preset };
  }
  return { from: range.fromDate, to: range.toDate };
}

/** The default range's name, for "Showing the last 7 days instead". */
export const DEFAULT_SALES_LABEL = presetLabel(DEFAULT_SALES_PRESET);

export function salesFiguresOf(summary) {
  const delivered = summary.ordersByStatus.DELIVERED ?? 0;
  const cancelled =
    (summary.ordersByStatus.CANCELLED ?? 0) + (summary.ordersByStatus.REJECTED ?? 0);
  return {
    sales: summary.deliveredOrdersValue,
    orders: summary.totalOrders,
    delivered,
    cancelled,
    inProgress: Math.max(0, summary.totalOrders - delivered - cancelled),
    averageOrder: delivered > 0 ? summary.deliveredOrdersValue / delivered : null,
    cancelledShare: summary.totalOrders > 0 ? (cancelled / summary.totalOrders) * 100 : null,
  };
}

/** The change from `before` to `now` in percent; null when there was nothing before (no percentage of zero). */
export function percentChange(now, before) {
  return before === 0 ? null : ((now - before) / before) * 100;
}
