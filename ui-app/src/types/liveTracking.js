/**
 * Where the delivery is, as the customer sees it on the map:
 * TO_RESTAURANT (the partner rides to the restaurant) -> AT_RESTAURANT (waits for the food) -> TO_CUSTOMER
 * (the food is on its way) -> DELIVERED.
 */
export const LIVE_TRACKING_PHASES = ['TO_RESTAURANT', 'AT_RESTAURANT', 'TO_CUSTOMER', 'DELIVERED'];
