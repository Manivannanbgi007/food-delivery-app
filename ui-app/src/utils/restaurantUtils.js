import { RESTAURANT_ACTIONS } from '@/types/restaurant';

/** The admin actions allowed from a status (the same rules restaurant-service applies). */
export function allowedRestaurantActions(status) {
  return Object.keys(RESTAURANT_ACTIONS).filter((action) =>
    RESTAURANT_ACTIONS[action].from.includes(status),
  );
}
