import { createListSlice } from '@/store/slices/createListSlice';

/** The delivery list's filters and page, kept while navigating. */
const initialFilters = {};
const deliveryListSlice = createListSlice('deliveryList', initialFilters);

export const {
  filtersChanged: deliveryFiltersChanged,
  filtersReplaced: deliveryFiltersReplaced,
  filtersCleared: deliveryFiltersCleared,
  pageChanged: deliveryPageChanged,
} = deliveryListSlice.actions;
export const { selectFilters: selectDeliveryFilters, selectPage: selectDeliveryPage } =
  deliveryListSlice.selectors;
export default deliveryListSlice.reducer;
