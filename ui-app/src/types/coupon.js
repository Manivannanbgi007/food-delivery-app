/** promotion-service: coupons (admin). */

/** Set by admins: an INACTIVE coupon cannot be used, whatever its dates. */
export const COUPON_STATUSES = ['ACTIVE', 'INACTIVE'];

/** PERCENTAGE: discountValue percent of the items, at most maxDiscount. FIXED: discountValue off. */
export const DISCOUNT_TYPES = ['PERCENTAGE', 'FIXED'];

/**
 * One use of a coupon: RESERVED at checkout, APPLIED once the order exists, REDEEMED when it is delivered;
 * RELEASED (order cancelled) or EXPIRED (checkout never finished) give the use back.
 */
export const REDEMPTION_STATUSES = ['RESERVED', 'APPLIED', 'REDEEMED', 'RELEASED', 'EXPIRED'];
