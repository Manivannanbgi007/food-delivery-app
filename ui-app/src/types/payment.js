/** payment-service (admin): payments and refunds. */

/** An admin refund needs the order to be finished one way or another (payment-service checks it again). */
export const REFUNDABLE_ORDER_STATUSES = ['CANCELLED', 'REJECTED', 'DELIVERED'];

/**
 * A payment's status in payment-service: INITIATED -> PROCESSING -> SUCCESS or FAILED; SUCCESS -> REFUNDED when
 * fully refunded (partly refunded stays SUCCESS). Not the same list as an order's paymentStatus in order-service
 * (PENDING, PAID, FAILED, REFUNDED).
 */
export const PAYMENT_RECORD_STATUSES = ['INITIATED', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED'];

/** REQUESTED -> PROCESSING -> SUCCESS or FAILED. */
export const REFUND_STATUSES = ['REQUESTED', 'PROCESSING', 'SUCCESS', 'FAILED'];
