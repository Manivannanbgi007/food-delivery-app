import { createListSlice } from '@/store/slices/createListSlice';

/** The admin notification list's filters and page, kept while navigating. */
const initialFilters = {};
const notificationListSlice = createListSlice('notificationList', initialFilters);

export const {
  filtersChanged: notificationFiltersChanged,
  filtersReplaced: notificationFiltersReplaced,
  filtersCleared: notificationFiltersCleared,
  pageChanged: notificationPageChanged,
} = notificationListSlice.actions;
export const { selectFilters: selectNotificationFilters, selectPage: selectNotificationPage } =
  notificationListSlice.selectors;
export default notificationListSlice.reducer;
