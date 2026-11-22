import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/utils/apiEndpoints';

const API = API_ENDPOINTS.owner;

/**
 * The restaurant owner's APIs: their own restaurants, the orders of each, and its menu. Every call names the
 * restaurant; the services answer 403/404 for one that is not the caller's, whatever the page asks.
 */
export const ownerService = {
  /** All the owner's restaurants, whatever their status. */
  getRestaurants: () => apiClient.get(API.restaurants),

  /** Registers a new restaurant; it starts as PENDING until the platform team approves it. */
  registerRestaurant: (request) => apiClient.post(API.restaurants, request),

  getRestaurant: (restaurantId) => apiClient.get(API.restaurant(restaurantId)),

  /** Changes the restaurant as a whole; 409 when it changed since `version` was read. */
  updateRestaurant: (restaurantId, update) => apiClient.put(API.restaurant(restaurantId), update),

  /** Replaces the weekly opening hours. */
  updateOperatingHours: (restaurantId, update) =>
    apiClient.put(API.operatingHours(restaurantId), update),

  /** Sends a rejected restaurant to the admins for review again. */
  resubmitRestaurant: (restaurantId) => apiClient.put(API.resubmit(restaurantId)),

  /** One page of the restaurant's orders (page 0 = the first). */
  getOrders: (restaurantId, filters, page, size) =>
    apiClient.get(API.orders(restaurantId), {
      params: { ...filters, page, size },
    }),

  /** How many orders match the filters: the list's own total, asked for with a one-row page (no count API). */
  countOrders: async (restaurantId, filters) => {
    const onePage = await apiClient.get(API.orders(restaurantId), {
      params: { ...filters, page: 0, size: 1 },
    });
    return onePage.totalElements;
  },

  getOrder: (restaurantId, orderId) => apiClient.get(API.order(restaurantId, orderId)),

  /** PLACED -> ACCEPTED */
  acceptOrder: (restaurantId, orderId) =>
    apiClient.put(API.orderAction(restaurantId, orderId, 'accept')),

  /** PLACED -> REJECTED; the reason is shown to the customer. */
  rejectOrder: (restaurantId, orderId, reason) =>
    apiClient.put(API.orderAction(restaurantId, orderId, 'reject'), { reason }),

  /** ACCEPTED -> PREPARING */
  startPreparing: (restaurantId, orderId) =>
    apiClient.put(API.orderAction(restaurantId, orderId, 'preparing')),

  /** PREPARING -> READY_FOR_PICKUP (a delivery partner is then offered the order) */
  markReady: (restaurantId, orderId) =>
    apiClient.put(API.orderAction(restaurantId, orderId, 'ready')),

  /** The orders and money of a period; days are 'YYYY-MM-DD', inclusive (none: today). */
  getSalesSummary: (restaurantId, fromDate, toDate) =>
    apiClient.get(API.salesSummary(restaurantId), {
      params: { fromDate, toDate },
    }),

  /** The most ordered dishes of a period (the API names the days `from` and `to`). */
  getTopItems: (restaurantId, fromDate, toDate) =>
    apiClient.get(API.topItems(restaurantId), {
      params: { from: fromDate, to: toDate },
    }),

  /** Every dish of the restaurant, whatever its status. */
  getMenuItems: (restaurantId) => apiClient.get(API.menuItems(restaurantId)),

  createMenuItem: (restaurantId, item) => apiClient.post(API.menuItems(restaurantId), item),

  /** Changes a dish as a whole; 409 when it changed since `version` was read. */
  updateMenuItem: (restaurantId, itemId, item) =>
    apiClient.put(API.menuItem(restaurantId, itemId), item),

  updatePrice: (restaurantId, itemId, price, version) =>
    apiClient.put(API.menuItemAction(restaurantId, itemId, 'price'), { price, version }),

  /** false = sold out for now (the dish stays on the menu); true = back in stock. */
  setAvailability: (restaurantId, itemId, available) =>
    apiClient.put(API.menuItemAction(restaurantId, itemId, 'availability'), {
      available,
    }),

  /** Shows a hidden dish on the menu again. */
  enableMenuItem: (restaurantId, itemId) =>
    apiClient.put(API.menuItemAction(restaurantId, itemId, 'enable')),

  /** Hides a dish from the menu. */
  disableMenuItem: (restaurantId, itemId) =>
    apiClient.put(API.menuItemAction(restaurantId, itemId, 'disable')),
};
