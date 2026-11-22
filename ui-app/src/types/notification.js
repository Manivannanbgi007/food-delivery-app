/** notification-service: the acting user's in-app inbox, and (admin) every notification the platform sends. */

/** What a notification is about (the text of each type is written by notification-service). */
export const NOTIFICATION_TYPES = [
  'WELCOME',
  'RESTAURANT_SUBMITTED',
  'RESTAURANT_APPROVED',
  'RESTAURANT_REJECTED',
  'RESTAURANT_LIVE',
  'RESTAURANT_DEACTIVATED',
  'RESTAURANT_SUSPENDED',
  'ORDER_PLACED',
  'ORDER_ACCEPTED',
  'ORDER_PREPARING',
  'ORDER_READY',
  'ORDER_OUT_FOR_DELIVERY',
  'ORDER_DELIVERED',
  'ORDER_CANCELLED',
  'PAYMENT_FAILED',
  'REFUND_COMPLETED',
  'NEW_ORDER_FOR_RESTAURANT',
  'ORDER_CANCELLED_FOR_RESTAURANT',
  'PARTNER_ON_THE_WAY',
  'DELIVERY_OFFERED',
  'DELIVERY_CANCELLED_FOR_PARTNER',
];

/** EMAIL (SMTP), SMS (simulated), PUSH (simulated, and the in-app inbox). */
export const NOTIFICATION_CHANNELS = ['EMAIL', 'SMS', 'PUSH'];

/**
 * PENDING: waiting to be sent or retried. FAILED: given up after the last attempt. SKIPPED: nothing to send it to
 * (an SMS for a user without a phone). Only FAILED and SKIPPED can be resent.
 */
export const NOTIFICATION_STATUSES = ['PENDING', 'SENT', 'FAILED', 'SKIPPED'];

export const RESENDABLE_STATUSES = ['FAILED', 'SKIPPED'];
