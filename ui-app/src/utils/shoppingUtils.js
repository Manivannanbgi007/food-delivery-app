import { toApiError } from '@/api/apiErrorHandler';

/**
 * Delivery is free from this amount (items after the discount). A copy of order-service's app.pricing setting,
 * only used for the "add X more" hint: the price on the screen always comes from the server.
 */
export const FREE_DELIVERY_FROM = 499;

/** order-service's limit per dish. */
export const MAX_QUANTITY_PER_DISH = 20;

/** An order waiting for an online payment is cancelled after this long (order-service). */
export const PAYMENT_WINDOW_MINUTES = 15;

/** How many dishes the cart holds (the number on the cart button). */
export function cartItemCount(cart) {
  return cart?.items.reduce((count, line) => count + line.quantity, 0) ?? 0;
}

/** How much more the customer could add for free delivery; null when delivery is free already. */
export function amountForFreeDelivery(price) {
  if (price.deliveryFee === 0 || price.itemsTotal === 0) {
    return null;
  }
  const missing = FREE_DELIVERY_FROM - (price.itemsTotal - price.discountAmount);
  return missing > 0 ? Math.round(missing * 100) / 100 : null;
}

/** The Luhn check card numbers carry (payment-service checks it too). */
export function isLuhnValid(digits) {
  let sum = 0;
  for (let index = 0; index < digits.length; index++) {
    let digit = Number(digits[digits.length - 1 - index]);
    if (index % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }
  return digits.length > 0 && sum % 10 === 0;
}

/**
 * Failures after which the request may still have been carried out (no answer, a timeout, a server error): a
 * retry must send the same Idempotency-Key, so the order or payment is never made twice. After any other refusal
 * nothing was done, and the next attempt gets a new key.
 */
const MAYBE_DONE = new Set([
  'network',
  'timeout',
  'gatewayTimeout',
  'badGateway',
  'server',
  'unknown',
]);

export function keepsIdempotencyKey(error) {
  return MAYBE_DONE.has(toApiError(error).kind);
}

/** When an unpaid order is cancelled by the system. */
export function paymentDeadline(order) {
  return new Date(new Date(order.createdAt).getTime() + PAYMENT_WINDOW_MINUTES * 60_000);
}

/** An order the restaurant can still work on: the payment step is over (or not needed). */
export function isPastPayment(status) {
  return status !== 'PAYMENT_PENDING' && status !== 'CANCELLED' && status !== 'REJECTED';
}

/** An address as lines: '12 MG Road', 'Flat 4', 'Bengaluru 560001', 'Karnataka, India' (empty parts left out). */
export function addressLines(address) {
  return [
    address.line1,
    address.line2,
    [address.city, address.postalCode].filter(Boolean).join(' '),
    [address.state, address.country].filter(Boolean).join(', '),
  ].filter((line) => Boolean(line));
}

/** The steps an order goes through after it is placed (the stepper on the customer's order page). */
export const ORDER_PROGRESS = [
  'PLACED',
  'ACCEPTED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

/**
 * Where an order stands, step by step. The timeline can repeat a status (a note that does not change it): the
 * first time a status was reached counts. An order waiting for payment has not started; a delivered one is done.
 */
export function orderProgress(order) {
  const reachedAt = new Map();
  for (const entry of order.timeline) {
    if (!reachedAt.has(entry.status)) {
      reachedAt.set(entry.status, entry.at);
    }
  }
  const current = ORDER_PROGRESS.indexOf(order.status);
  return ORDER_PROGRESS.map((status, index) => ({
    status,
    at: reachedAt.get(status) ?? null,
    state:
      index < current || (index === current && status === 'DELIVERED')
        ? 'done'
        : index === current
          ? 'current'
          : 'upcoming',
  }));
}

/** An order that will not change any more: delivered, or cancelled / rejected (nothing to refresh). */
export function isFinishedOrder(status) {
  return status === 'DELIVERED' || status === 'CANCELLED' || status === 'REJECTED';
}

/** From "food ready" on, the order has a delivery to follow. */
/**
 * Whether the live map is offered: from the restaurant accepting (a partner may already ride to it) until the
 * food is delivered. The live tracking itself says when no partner is on the way yet.
 */
export function canTrackLive(status) {
  return (
    status === 'ACCEPTED' ||
    status === 'PREPARING' ||
    status === 'READY_FOR_PICKUP' ||
    status === 'OUT_FOR_DELIVERY'
  );
}

export function hasDelivery(status) {
  return status === 'READY_FOR_PICKUP' || status === 'OUT_FOR_DELIVERY' || status === 'DELIVERED';
}
