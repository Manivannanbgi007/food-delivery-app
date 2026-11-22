/**
 * What a signed-in customer buys with: the cart (order-service), their addresses (user-service), offers
 * (promotion-service), checkout (order-service) and paying (payment-service).
 */

export const ADDRESS_TYPES = ['HOME', 'WORK', 'OTHER'];

/** A customer may cancel an order only before the restaurant accepts it (order-service checks it too). */
export const CUSTOMER_CANCELLABLE_STATUSES = ['PAYMENT_PENDING', 'PLACED'];
