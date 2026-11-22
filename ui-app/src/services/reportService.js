import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/utils/apiEndpoints';

/**
 * admin-service reports. A report never fails because one service is down: its figures are null and the service
 * is named in `unavailable`.
 */
export const reportService = {
  getOrderReport: (params) =>
    apiClient.get(API_ENDPOINTS.admin.reports.orders, { params: { ...params } }),

  getRevenueReport: (params, groupBy) =>
    apiClient.get(API_ENDPOINTS.admin.reports.revenue, {
      params: { ...params, groupBy },
    }),

  getRestaurantReport: (params) =>
    apiClient.get(API_ENDPOINTS.admin.reports.restaurants, {
      params: { ...params },
    }),

  getCustomerReport: (params) =>
    apiClient.get(API_ENDPOINTS.admin.reports.customers, { params: { ...params } }),

  getDeliveryReport: (params) =>
    apiClient.get(API_ENDPOINTS.admin.reports.deliveries, {
      params: { ...params },
    }),
};
