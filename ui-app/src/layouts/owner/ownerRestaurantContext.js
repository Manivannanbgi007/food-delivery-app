import { createContext, useContext } from 'react';

export const OwnerRestaurantsContext = createContext(null);

export function useOwnerRestaurants() {
  const state = useContext(OwnerRestaurantsContext);
  if (!state) {
    throw new Error('The owner frame needs an <OwnerRestaurantsProvider> around it');
  }
  return state;
}

export const OwnerRestaurantContext = createContext(null);

/**
 * The restaurant an owner page works on: `const { restaurantId, restaurant } = useOwnerRestaurant();`.
 * An owner may have several restaurants; the header's selector decides which one the pages show. The pages are
 * only shown once there is one (see OwnerRestaurantGate), so it is never missing here.
 */
export function useOwnerRestaurant() {
  const value = useContext(OwnerRestaurantContext);
  if (!value) {
    throw new Error('Owner pages need an <OwnerRestaurantGate> around them');
  }
  return value;
}
