import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/utils/apiEndpoints';

/** delivery-service admin APIs: deliveries and delivery partners. */
export const deliveryService = {
  /**
   * The customer's view of their order's delivery: status, partner, steps. 404 until the restaurant has the food
   * ready (the delivery starts then).
   */
  getOrderTracking: (orderId) => apiClient.get(API_ENDPOINTS.delivery.tracking(orderId)),

  searchDeliveries: (filters, page, size) =>
    apiClient.get(API_ENDPOINTS.admin.deliveries.list, {
      params: { ...filters, page, size, sort: 'createdAt,desc' },
    }),

  /**
   * Late deliveries right now, longest waiting first: no partner 10 minutes after the food was ready, or not
   * delivered 45 minutes after it.
   */
  getDelayedDeliveries: (page, size) =>
    apiClient.get(API_ENDPOINTS.admin.deliveries.delayed, {
      params: { page, size },
    }),

  /** Deliveries of a period (no dates: today), and how many are late now. */
  getSummary: (fromDate, toDate) =>
    apiClient.get(API_ENDPOINTS.admin.deliveries.summary, {
      params: { fromDate, toDate },
    }),

  getDelivery: (deliveryId) => apiClient.get(API_ENDPOINTS.admin.deliveries.details(deliveryId)),

  /**
   * A delivery not picked up yet goes to another AVAILABLE partner (who still has to accept), or, without
   * partnerUserId, back to the queue for the assignment job. Audited.
   */
  reassignDelivery: (deliveryId, partnerUserId, reason) =>
    apiClient.put(API_ENDPOINTS.admin.deliveries.reassign(deliveryId), {
      partnerUserId,
      reason,
    }),

  getDeliveryAuditLogs: (deliveryId) =>
    apiClient.get(API_ENDPOINTS.admin.deliveries.auditLogs(deliveryId), { params: { size: 50 } }),

  searchPartners: (filters, page, size) =>
    apiClient.get(API_ENDPOINTS.admin.partners.list, {
      params: { ...filters, page, size },
    }),

  /** How many partners are available, busy, offline and suspended right now. */
  getPartnerAvailability: () => apiClient.get(API_ENDPOINTS.admin.partners.availability),

  getPartner: (userId) => apiClient.get(API_ENDPOINTS.admin.partners.details(userId)),

  /** The deliveries the partner has now (newest first; ones taken away from them are not listed). */
  getPartnerDeliveries: (userId, page, size) =>
    apiClient.get(API_ENDPOINTS.admin.partners.deliveries(userId), {
      params: { page, size },
    }),

  /** Suspend (not while on a delivery: reassign it first) or reactivate (they start OFFLINE). Audited. */
  changePartnerStatus: (userId, activate, reason) =>
    apiClient.put(
      activate
        ? API_ENDPOINTS.admin.partners.activate(userId)
        : API_ENDPOINTS.admin.partners.deactivate(userId),
      { reason },
    ),

  getPartnerAuditLogs: (userId) =>
    apiClient.get(API_ENDPOINTS.admin.partners.auditLogs(userId), {
      params: { size: 50 },
    }),
};
