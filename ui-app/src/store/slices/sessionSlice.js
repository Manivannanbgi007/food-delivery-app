import { createSlice } from '@reduxjs/toolkit';

import {
  loadSignedInAdmin,
  loadSignedInCustomer,
  loadSignedInOwner,
  loadSignedInPartner,
} from '@/utils/sessionUtils';

/**
 * Who signed in to each area, shared by the whole application (the pages and headers show it). Each area acts as
 * the person who signed in to it, with that area's access token (api/tokenStore.js, in memory only); which area a
 * page belongs to is decided by its address (see utils/sessionUtils.js and hooks/useActingUser.js). Only who they are
 * is kept here and in sessionStorage, never a token.
 */

const initialState = {
  adminUser: loadSignedInAdmin(),
  customer: loadSignedInCustomer(),
  owner: loadSignedInOwner(),
  partner: loadSignedInPartner(),
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    adminSignedIn(state, action) {
      state.adminUser = action.payload;
    },
    adminSignedOut(state) {
      state.adminUser = null;
    },
    customerSignedIn(state, action) {
      state.customer = action.payload;
    },
    customerSignedOut(state) {
      state.customer = null;
    },
    ownerSignedIn(state, action) {
      state.owner = action.payload;
    },
    ownerSignedOut(state) {
      state.owner = null;
    },
    partnerSignedIn(state, action) {
      state.partner = action.payload;
    },
    partnerSignedOut(state) {
      state.partner = null;
    },
  },
  selectors: {
    // Only a platform administrator account is the admin (the admin sign-in refuses the others)
    selectAdminUser: (state) =>
      state.adminUser?.role === 'PLATFORM_ADMIN' ? state.adminUser : null,
    // Each area is for its own kind of account only (the sign-ins refuse the others): a saved or injected session of
    // another role counts as signed out, so every page (guard, sign-in, header) agrees and none redirects forever
    selectCustomer: (state) => (state.customer?.role === 'CUSTOMER' ? state.customer : null),
    selectOwner: (state) => (state.owner?.role === 'RESTAURANT_ADMIN' ? state.owner : null),
    selectPartner: (state) => (state.partner?.role === 'DELIVERY_PARTNER' ? state.partner : null),
  },
});

export const {
  adminSignedIn,
  adminSignedOut,
  customerSignedIn,
  customerSignedOut,
  ownerSignedIn,
  ownerSignedOut,
  partnerSignedIn,
  partnerSignedOut,
} = sessionSlice.actions;
export const { selectAdminUser, selectCustomer, selectOwner, selectPartner } =
  sessionSlice.selectors;
export default sessionSlice.reducer;
