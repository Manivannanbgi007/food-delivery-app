import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/utils/apiEndpoints';

/** admin-service's calendar: orders per day, coupon campaigns and new restaurants between two days. */
export const calendarService = {
  /** Both days included (at most 400 days apart); `types` left out means every type. */
  getCalendar: (from, to, types) =>
    apiClient.get(API_ENDPOINTS.admin.calendar, {
      params: { from, to, ...(types && types.length > 0 ? { types: types.join(',') } : {}) },
    }),
};
