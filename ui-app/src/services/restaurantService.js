import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/utils/apiEndpoints';

/** restaurant-service APIs: the admin's, and the public restaurant list and details. */
export const restaurantService = {
  /** Public: restaurants customers can order from (ACTIVE only), with whether each is open now. */
  browseRestaurants: (filters, page, size) =>
    apiClient.get(API_ENDPOINTS.storefront.restaurants, {
      params: { ...filters, page, size },
    }),

  /** Public: one restaurant with its address and opening hours (404 when it is not taking orders). */
  getStoreRestaurant: (restaurantId) =>
    apiClient.get(API_ENDPOINTS.storefront.restaurant(restaurantId)),

  /** Restaurants matching the filters, one page (page 0 = the first). */
  searchRestaurants: (filters, page, size) =>
    apiClient.get(API_ENDPOINTS.admin.restaurants.list, {
      params: { ...filters, page, size },
    }),

  /** The restaurant and its owner. */
  getRestaurant: (restaurantId) =>
    apiClient.get(API_ENDPOINTS.admin.restaurants.details(restaurantId)),

  /**
   * approve / reject (a PENDING restaurant), activate, deactivate, suspend. Audited; the reason is shown to the
   * owner.
   */
  changeStatus: (restaurantId, action, reason) =>
    apiClient.put(API_ENDPOINTS.admin.restaurants.action(restaurantId, action), {
      reason,
    }),

  getAuditLogs: (restaurantId) =>
    apiClient.get(API_ENDPOINTS.admin.restaurants.auditLogs(restaurantId), {
      params: { size: 50 },
    }),
};
