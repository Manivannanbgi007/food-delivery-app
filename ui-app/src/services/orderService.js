import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS, IDEMPOTENCY_KEY_HEADER } from '@/utils/apiEndpoints';

/** order-service APIs: the admin's, and the signed-in customer's cart and orders. */
export const orderService = {
  getCart: () => apiClient.get(API_ENDPOINTS.cart.cart),

  /**
   * Sets how many of a dish are in the cart (1 to 20), adding it when needed. 409 when the cart holds another
   * restaurant's dishes: the customer clears the cart first.
   */
  setCartQuantity: (menuItemId, quantity) =>
    apiClient.put(API_ENDPOINTS.cart.item(menuItemId), { quantity }),

  removeFromCart: (menuItemId) => apiClient.delete(API_ENDPOINTS.cart.item(menuItemId)),

  /** Empties the cart (and removes its coupon); never fails. */
  clearCart: () => apiClient.delete(API_ENDPOINTS.cart.cart),

  /** Applies a coupon to the cart (422 with the reason when it cannot be used: too small an order, expired, ...). */
  applyCoupon: (code) => apiClient.put(API_ENDPOINTS.cart.coupon, { code }),

  removeCoupon: () => apiClient.delete(API_ENDPOINTS.cart.coupon),

  /**
   * Checkout: the cart (with its coupon) becomes an order and the cart is emptied. Online payments start as
   * PAYMENT_PENDING (paid next), cash on delivery as PLACED. The key makes a retry safe: the same key and request
   * return the order already created instead of a second one.
   */
  placeOrder: (request, idempotencyKey) =>
    apiClient.post(API_ENDPOINTS.orders.list, request, {
      headers: { [IDEMPOTENCY_KEY_HEADER]: idempotencyKey },
    }),

  /** The signed-in customer's orders, newest first (optionally of one status). */
  getMyOrders: (status, page, size) =>
    apiClient.get(API_ENDPOINTS.orders.list, {
      params: { status, page, size, sort: 'createdAt,desc' },
    }),

  /**
   * The customer cancels before the restaurant accepts (409 afterwards). What was paid online is refunded by
   * itself; the coupon can be used again.
   */
  cancelMyOrder: (orderId, reason) =>
    apiClient.put(API_ENDPOINTS.orders.cancel(orderId), { reason }),

  /** The signed-in customer's orders in numbers, all time (their dashboard's cards). */
  getMySummary: () => apiClient.get(API_ENDPOINTS.orders.summary),

  /** What the signed-in customer ordered and spent from one day to another ('YYYY-MM-DD'), day by day. */
  getMyActivity: (fromDate, toDate) =>
    apiClient.get(API_ENDPOINTS.orders.activity, {
      params: { fromDate, toDate },
    }),

  /** The dishes the signed-in customer orders most, with today's price and stock (503 when not confirmed). */
  getMyFavouriteDishes: (limit) =>
    apiClient.get(API_ENDPOINTS.orders.favouriteDishes, { params: { limit } }),

  /** One of the signed-in customer's orders, with its timeline (404 for anybody else's). */
  getMyOrder: (orderId) => apiClient.get(API_ENDPOINTS.orders.details(orderId)),

  /** Orders matching the filters, newest first, one page (page 0 = the first). */
  searchOrders: (filters, page, size) =>
    apiClient.get(API_ENDPOINTS.admin.orders.list, {
      params: { ...filters, page, size, sort: 'createdAt,desc' },
    }),

  getOrder: (orderId) => apiClient.get(API_ENDPOINTS.admin.orders.details(orderId)),

  /** Admin intervention (audited): the customer is told, and refunded if they paid online. */
  cancelOrder: (orderId, reason) =>
    apiClient.put(API_ENDPOINTS.admin.orders.cancel(orderId), { reason }),

  getAuditLogs: (orderId) =>
    apiClient.get(API_ENDPOINTS.admin.orders.auditLogs(orderId), {
      params: { size: 50 },
    }),

  /** A customer's orders in numbers (for the customer screen). */
  getCustomerSummary: (customerId) =>
    apiClient.get(API_ENDPOINTS.admin.orders.customerSummary(customerId)),

  /** A dish's revenue from delivered orders: the last 12 months, 12 weeks or 30 days (empty ones included). */
  getDishRevenue: (menuItemId, period) =>
    apiClient.get(API_ENDPOINTS.admin.orders.dishRevenue(menuItemId), {
      params: { period },
    }),

  /** The dishes a customer orders most, by total spent (delivered orders). */
  getCustomerTopFoods: (customerId, period, limit) =>
    apiClient.get(API_ENDPOINTS.admin.orders.customerTopFoods(customerId), {
      params: { period, limit },
    }),
};
