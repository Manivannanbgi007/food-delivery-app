import { Route, Routes } from 'react-router';

import { OwnerRestaurantContext } from '@/layouts/owner/ownerRestaurantContext';
import { makeStore } from '@/store/store';
import { restaurantSummary } from '@/test/fixtures';
import { renderWithProviders } from '@/test/renderWithProviders';

/** A signed-in restaurant owner (the session of the owner area). */
export const ownerUser = {
  id: 423,
  role: 'RESTAURANT_ADMIN',
  fullName: 'Test Owner',
  email: 'test.owner@fooddelivery.local',
};

/**
 * Renders an owner page the way the owner area does: signed in as an owner, with a restaurant chosen (the
 * `useOwnerRestaurant()` of the page works), at the address `route` that matches `path` (for pages that read the
 * address, e.g. '/owner/orders/:orderId'). Returns what renderWithProviders returns.
 */
export function renderOwnerPage(
  page,
  path,
  { route = path, restaurant = restaurantSummary({ ownerUserId: ownerUser.id }) } = {},
) {
  return renderWithProviders(
    <OwnerRestaurantContext.Provider
      value={{
        restaurants: [restaurant],
        restaurant,
        restaurantId: restaurant.id,
        select: () => undefined,
      }}
    >
      <Routes>
        <Route path={path} element={page} />
      </Routes>
    </OwnerRestaurantContext.Provider>,
    {
      route,
      store: makeStore({ session: { adminUser: null, customer: null, owner: ownerUser } }),
    },
  );
}
