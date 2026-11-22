/** Order statuses of order-service, in the order an order moves through them. */
export const ORDER_STATUSES = [
  'PAYMENT_PENDING',
  'PLACED',
  'ACCEPTED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'REJECTED',
];

/**
 * Statuses an admin may still cancel (order-service OrderStatus: everything before OUT_FOR_DELIVERY that is not
 * finished). The server checks it again; this only decides whether the button is shown.
 */
export const ADMIN_CANCELLABLE_STATUSES = [
  'PAYMENT_PENDING',
  'PLACED',
  'ACCEPTED',
  'PREPARING',
  'READY_FOR_PICKUP',
];

export const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

export const PAYMENT_METHODS = ['CASH_ON_DELIVERY', 'CARD', 'UPI', 'WALLET'];

/** The windows of a dish's revenue chart: the last 12 months, 12 weeks or 30 days. */
export const DISH_REVENUE_PERIODS = ['MONTHLY', 'WEEKLY', 'DAILY'];
