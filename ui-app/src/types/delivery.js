/** delivery-service (admin): deliveries and delivery partners. */

/**
 * PENDING (food ready, waiting for a partner) -> ASSIGNED (offered, not accepted yet) -> ACCEPTED (partner on the
 * way to the restaurant) -> PICKED_UP -> DELIVERED; any unfinished delivery becomes CANCELLED with its order.
 */
export const DELIVERY_STATUSES = [
  'PENDING',
  'ASSIGNED',
  'ACCEPTED',
  'PICKED_UP',
  'DELIVERED',
  'CANCELLED',
];

/** Before pickup another partner can still take over (delivery-service checks it again). */
export const REASSIGNABLE_STATUSES = ['PENDING', 'ASSIGNED', 'ACCEPTED'];

/**
 * OFFLINE / AVAILABLE: switched by the partner. BUSY: set by the system from the moment a delivery is offered.
 * SUSPENDED: only an admin suspends or reactivates a partner.
 */
export const PARTNER_STATUSES = ['OFFLINE', 'AVAILABLE', 'BUSY', 'SUSPENDED'];

export const VEHICLE_TYPES = ['BICYCLE', 'SCOOTER', 'MOTORCYCLE', 'CAR'];
