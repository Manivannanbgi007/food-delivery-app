import { CHART_COLORS } from '@/utils/chartColors';

/**
 * The period's orders by where they stand now, in four groups the customer recognises. Each has its colour (the
 * legend's dot and the gradient's light end), the gradient's deep end, and a light tint for its row (a class name).
 */
export const STATUS_GROUPS = [
  {
    key: 'delivered',
    label: 'Delivered',
    statuses: ['DELIVERED'],
    color: CHART_COLORS.brand,
    to: CHART_COLORS.deepGreen,
    tint: 'bg-st-delivered-soft',
  },
  {
    key: 'inProgress',
    label: 'In progress',
    statuses: ['PLACED', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'],
    color: CHART_COLORS.info,
    to: CHART_COLORS.blue,
    tint: 'bg-st-ready-soft',
  },
  {
    key: 'waiting',
    label: 'Waiting for payment',
    statuses: ['PAYMENT_PENDING'],
    color: CHART_COLORS.warning,
    to: CHART_COLORS.sunset,
    tint: 'bg-st-preparing-soft',
  },
  {
    key: 'cancelled',
    label: 'Cancelled or declined',
    statuses: ['CANCELLED', 'REJECTED'],
    color: CHART_COLORS.danger,
    to: CHART_COLORS.rose,
    tint: 'bg-st-rejected-soft',
  },
];

export function figuresOf(activity) {
  const total = activity.totalOrders;
  const groups = STATUS_GROUPS.map((group) => {
    const count = group.statuses.reduce(
      (sum, status) => sum + (activity.ordersByStatus[status] ?? 0),
      0,
    );
    return {
      key: group.key,
      label: group.label,
      color: group.color,
      to: group.to,
      tint: group.tint,
      count,
      share: total > 0 ? (count / total) * 100 : 0,
    };
  });
  let spentSoFar = 0;
  const days = activity.perDay.map((day) => {
    spentSoFar += day.revenue;
    return {
      date: day.date,
      orders: day.orders,
      delivered: day.completed,
      cancelled: day.cancelled,
      other: Math.max(0, day.orders - day.completed - day.cancelled),
      spent: day.revenue,
      spentSoFar,
    };
  });
  const delivered = groups[0].count;
  const most = (pick) =>
    days.reduce((best, day) => (pick(day) > (best ? pick(best) : 0) ? day : best), null);
  return {
    orders: total,
    spent: activity.spent,
    delivered,
    averageOrder: delivered > 0 ? activity.spent / delivered : null,
    deliveredShare: total > 0 ? (delivered / total) * 100 : null,
    groups,
    days,
    daysWithOrders: days.filter((day) => day.orders > 0).length,
    busiestDay: most((day) => day.orders),
    biggestSpendDay: most((day) => day.spent),
  };
}

/** The change from `before` to `now` in percent; null when there is nothing to compare with (before was 0). */
export function changeOf(now, before) {
  return before === 0 ? null : ((now - before) / before) * 100;
}

/**
 * The three parts of a day's orders, bottom to top, as the bars and their legend show them: each bar part is a
 * gradient from its colour (top) to a deeper one; its legend chip has the light tint (a class name).
 */
export const ORDER_SERIES = [
  {
    key: 'delivered',
    label: 'Delivered',
    color: CHART_COLORS.brand,
    to: CHART_COLORS.deepGreen,
    tint: 'bg-st-delivered-soft',
  },
  {
    key: 'other',
    label: 'In progress or waiting',
    color: CHART_COLORS.info,
    to: CHART_COLORS.indigo,
    tint: 'bg-st-ready-soft',
  },
  {
    key: 'cancelled',
    label: 'Cancelled or declined',
    color: CHART_COLORS.danger,
    to: CHART_COLORS.rose,
    tint: 'bg-st-rejected-soft',
  },
];
