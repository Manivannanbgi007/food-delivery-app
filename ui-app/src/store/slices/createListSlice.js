import { createSlice } from '@reduxjs/toolkit';

import { withoutEmptyValues } from '@/utils/objectUtils';

/**
 * Builds the Redux slice of an admin list. Every list works the same way, so this is written once:
 *
 *   const initialFilters = {};
 *   const orderListSlice = createListSlice('orderList', initialFilters);
 *
 * Actions: filtersChanged (some filters; back to the first page), filtersReplaced (all filters, e.g. "orders of
 * customer 7" from another page), filtersCleared (back to `initialFilters`), pageChanged.
 * Empty values (undefined, '') are dropped, so "no status chosen" is one state (and one React Query key).
 * (The reducers return a new state instead of changing it, whatever the filters are.)
 */
export function createListSlice(name, initialFilters) {
  const initialState = { filters: initialFilters, page: 0 };

  return createSlice({
    name,
    initialState,
    reducers: {
      filtersChanged: (state, action) => ({
        filters: withoutEmptyValues({ ...state.filters, ...action.payload }),
        page: 0,
      }),
      filtersReplaced: (_state, action) => ({
        filters: withoutEmptyValues({ ...initialFilters, ...action.payload }),
        page: 0,
      }),
      filtersCleared: () => initialState,
      pageChanged: (state, action) => ({
        filters: state.filters,
        page: action.payload,
      }),
    },
    selectors: {
      selectFilters: (state) => state.filters,
      selectPage: (state) => state.page,
    },
  });
}
