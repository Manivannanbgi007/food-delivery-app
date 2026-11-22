import { Route, Routes } from 'react-router';

import { makeStore } from '@/store/store';
import { renderWithProviders } from '@/test/renderWithProviders';

/** A signed-in delivery partner (the session of the partner area); the fixtures' partner() has the same id. */
export const partnerUser = {
  id: 31,
  role: 'DELIVERY_PARTNER',
  fullName: 'Ravi Kumar',
  email: 'ravi.rider@example.com',
};

/** A store whose partner area is signed in as partnerUser. */
export const signedInPartnerStore = () =>
  makeStore({ session: { adminUser: null, customer: null, owner: null, partner: partnerUser } });

/**
 * Renders a partner page as the partner area does: signed in as a delivery partner, at the address `route` that
 * matches `path` (for pages that read the address, e.g. '/partner/deliveries/:deliveryId').
 */
export function renderPartnerPage(page, path, route = path) {
  return renderWithProviders(
    <Routes>
      <Route path={path} element={page} />
    </Routes>,
    { route, store: signedInPartnerStore() },
  );
}
