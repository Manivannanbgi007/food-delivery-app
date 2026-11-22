import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/utils/apiEndpoints';

const API = API_ENDPOINTS.partner;

/**
 * The signed-in delivery partner's APIs. The profile belongs to delivery-partner-service; going online and the
 * deliveries to delivery-service (it decides who gets which delivery). A partner only ever sees the deliveries
 * offered to them: any other id is "not found".
 */
export const partnerService = {
  /** The partner's profile and status (created on the first call if the account is a delivery partner). */
  getMe: () => apiClient.get(API.me),

  /** Vehicle and city: needed before going online. */
  updateProfile: (update) => apiClient.put(API.me, update),

  /**
   * Online (AVAILABLE: deliveries in the partner's city are offered to them) or OFFLINE. 409 while on a delivery or
   * when suspended, 422 when the vehicle or city is missing.
   */
  changeAvailability: (status) => apiClient.put(API.availability, { status }),

  /** The delivery offered to the partner or being worked on now, or null when there is none (204). */
  getCurrentDelivery: async () => {
    // A 204 answer has an empty body
    const delivery = await apiClient.get(API.currentDelivery);
    return delivery || null;
  },

  /** The partner's deliveries, newest first. */
  getDeliveries: (status, page, size) =>
    apiClient.get(API.deliveries, {
      params: { status, page, size, sort: 'createdAt,desc' },
    }),

  getDelivery: (deliveryId) => apiClient.get(API.delivery(deliveryId)),

  /** ASSIGNED -> ACCEPTED: the partner goes to the restaurant. */
  acceptDelivery: (deliveryId) => apiClient.put(API.deliveryAction(deliveryId, 'accept')),

  /** Says no to an offer: it goes to another partner (204). */
  declineDelivery: (deliveryId, reason) =>
    apiClient.put(API.deliveryAction(deliveryId, 'decline'), reason ? { reason } : {}),

  /** ACCEPTED -> PICKED_UP: the food is with the partner (the order is "out for delivery"). */
  pickUpDelivery: (deliveryId) => apiClient.put(API.deliveryAction(deliveryId, 'pickup')),

  /** PICKED_UP -> DELIVERED. Cash on delivery: the exact amount collected must be confirmed. */
  completeDelivery: (deliveryId, cashCollected) =>
    apiClient.put(
      API.deliveryAction(deliveryId, 'deliver'),
      cashCollected === null ? {} : { cashCollected },
    ),

  /**
   * The partner's phone position while they are on the way (204). 409 once the delivery is no longer on its way (it
   * was delivered or cancelled). One sent sooner than 2 s after the last is skipped.
   */
  shareLocation: (deliveryId, update) => apiClient.put(API.deliveryLocation(deliveryId), update),
};
