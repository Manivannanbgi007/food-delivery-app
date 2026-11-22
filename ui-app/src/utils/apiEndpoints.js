/**
 * Every REST API the application calls, in one place (paths behind the API Gateway; the gateway's address is
 * VITE_API_BASE_URL). Services use these constants; components never contain a URL.
 */
export const API_ENDPOINTS = {
  // user-service: register, and the sign-in sessions (an access token, and a refresh cookie per area)
  auth: {
    register: '/api/v1/auth/register',
    login: '/api/v1/auth/login',
    refresh: '/api/v1/auth/refresh',
    logout: '/api/v1/auth/logout',
  },
  users: {
    me: '/api/v1/users/me',
    password: '/api/v1/users/me/password',
    addresses: '/api/v1/users/me/addresses',
    address: (addressId) => `/api/v1/users/me/addresses/${addressId}`,
    defaultAddress: (addressId) => `/api/v1/users/me/addresses/${addressId}/default`,
  },
  // ai-mcp-client: the AI assistant (chat, history, order proposals)
  assistant: {
    chat: '/api/v1/assistant/chat',
    conversation: '/api/v1/assistant/conversation',
    confirm: (actionId) => `/api/v1/assistant/actions/${encodeURIComponent(actionId)}/confirm`,
    cancel: (actionId) => `/api/v1/assistant/actions/${encodeURIComponent(actionId)}/cancel`,
    suggestions: '/api/v1/assistant/suggestions',
    status: '/api/v1/assistant/status',
  },
  // order-service: the signed-in customer's cart and orders
  cart: {
    cart: '/api/v1/cart',
    item: (menuItemId) => `/api/v1/cart/items/${menuItemId}`,
    coupon: '/api/v1/cart/coupon',
  },
  orders: {
    list: '/api/v1/orders',
    details: (orderId) => `/api/v1/orders/${orderId}`,
    cancel: (orderId) => `/api/v1/orders/${orderId}/cancel`,
    // The signed-in customer's dashboard (always their own orders: the customer is the access token's)
    summary: '/api/v1/orders/summary',
    activity: '/api/v1/orders/activity',
    favouriteDishes: '/api/v1/orders/favourite-dishes',
  },
  // The restaurant owner's own restaurants (restaurant-service), their orders (order-service) and menu (catalog-service)
  // The signed-in delivery partner: profile (delivery-partner-service), going online and the deliveries
  // (delivery-service); the API Gateway sends each path to its service
  partner: {
    me: '/api/v1/delivery/partners/me',
    availability: '/api/v1/delivery/partners/me/availability',
    currentDelivery: '/api/v1/delivery/deliveries/mine/current',
    deliveries: '/api/v1/delivery/deliveries/mine',
    delivery: (deliveryId) => `/api/v1/delivery/deliveries/mine/${deliveryId}`,
    /** action: accept, decline (optional reason), pickup, deliver (cashCollected for cash on delivery) */
    deliveryAction: (deliveryId, action) =>
      `/api/v1/delivery/deliveries/mine/${deliveryId}/${action}`,
    /** PUT the partner's GPS position while they are on the way (204) */
    deliveryLocation: (deliveryId) => `/api/v1/delivery/deliveries/mine/${deliveryId}/location`,
  },
  owner: {
    restaurants: '/api/v1/restaurants/mine',
    restaurant: (restaurantId) => `/api/v1/restaurants/mine/${restaurantId}`,
    operatingHours: (restaurantId) => `/api/v1/restaurants/mine/${restaurantId}/operating-hours`,
    resubmit: (restaurantId) => `/api/v1/restaurants/mine/${restaurantId}/resubmit`,
    orders: (restaurantId) => `/api/v1/restaurants/mine/${restaurantId}/orders`,
    order: (restaurantId, orderId) => `/api/v1/restaurants/mine/${restaurantId}/orders/${orderId}`,
    /** action: accept, reject (with a reason), preparing, ready */
    orderAction: (restaurantId, orderId, action) =>
      `/api/v1/restaurants/mine/${restaurantId}/orders/${orderId}/${action}`,
    salesSummary: (restaurantId) => `/api/v1/restaurants/mine/${restaurantId}/orders/sales-summary`,
    topItems: (restaurantId) => `/api/v1/restaurants/mine/${restaurantId}/orders/top-items`,
    menuItems: (restaurantId) => `/api/v1/restaurants/mine/${restaurantId}/menu-items`,
    menuItem: (restaurantId, itemId) =>
      `/api/v1/restaurants/mine/${restaurantId}/menu-items/${itemId}`,
    /** action: price, availability, enable, disable */
    menuItemAction: (restaurantId, itemId, action) =>
      `/api/v1/restaurants/mine/${restaurantId}/menu-items/${itemId}/${action}`,
  },
  // delivery-service: following the delivery of one's order
  delivery: {
    tracking: (orderId) => `/api/v1/delivery/orders/${orderId}`,
    /** The partner's live GPS position while they are on the way, and the two stops (see liveTrackingService) */
    liveTracking: (orderId) => `/api/v1/delivery/orders/${orderId}/live`,
  },
  // payment-service: paying an order
  payments: {
    pay: '/api/v1/payments',
    // Razorpay Checkout (when payment-service runs with PAYMENT_PROVIDER=RAZORPAY)
    razorpay: {
      config: '/api/v1/payments/razorpay/config',
      orders: '/api/v1/payments/razorpay/orders',
      verify: '/api/v1/payments/razorpay/verify',
    },
  },
  // Public: what every visitor sees (restaurant-, catalog- and search-service)
  storefront: {
    restaurants: '/api/v1/restaurants',
    restaurant: (restaurantId) => `/api/v1/restaurants/${restaurantId}`,
    menu: (restaurantId) => `/api/v1/restaurants/${restaurantId}/menu`,
    categories: '/api/v1/categories',
    // promotion-service
    offers: '/api/v1/coupons',
  },
  search: {
    restaurants: '/api/v1/search/restaurants',
    foods: '/api/v1/search/foods',
    suggest: '/api/v1/search/suggest',
  },
  // review-service: a customer's review of an order
  reviews: {
    create: '/api/v1/reviews',
    ofOrder: (orderId) => `/api/v1/reviews/orders/${orderId}`,
    review: (reviewId) => `/api/v1/reviews/${reviewId}`,
  },
  // review-service: the public ratings (average and number of reviews) of restaurants and dishes
  ratings: {
    restaurants: '/api/v1/ratings/restaurants',
    menuItems: '/api/v1/ratings/menu-items',
    restaurant: (restaurantId) => `/api/v1/ratings/restaurants/${restaurantId}`,
    menuItem: (menuItemId) => `/api/v1/ratings/menu-items/${menuItemId}`,
    restaurantReviews: (restaurantId) => `/api/v1/ratings/restaurants/${restaurantId}/reviews`,
    menuItemReviews: (menuItemId) => `/api/v1/ratings/menu-items/${menuItemId}/reviews`,
  },
  // notification-service: the acting user's inbox
  notifications: {
    list: '/api/v1/notifications',
    unreadCount: '/api/v1/notifications/unread-count',
    markRead: (notificationId) => `/api/v1/notifications/${notificationId}/read`,
    markAllRead: '/api/v1/notifications/read-all',
  },
  // chat-service: the participant's own conversation with Support
  chat: {
    conversation: '/api/v1/chat/conversation',
    messages: '/api/v1/chat/messages',
    read: '/api/v1/chat/read',
  },
  admin: {
    dashboard: '/api/v1/admin/dashboard',
    orderActivity: '/api/v1/admin/dashboard/order-activity',
    calendar: '/api/v1/admin/calendar',
    reports: {
      orders: '/api/v1/admin/reports/orders',
      revenue: '/api/v1/admin/reports/revenue',
      restaurants: '/api/v1/admin/reports/restaurants',
      customers: '/api/v1/admin/reports/customers',
      deliveries: '/api/v1/admin/reports/deliveries',
    },
    auditLogs: {
      list: '/api/v1/admin/audit-logs',
      actions: '/api/v1/admin/audit-logs/actions',
      details: (auditId) => `/api/v1/admin/audit-logs/${auditId}`,
      backfill: '/api/v1/admin/audit-logs/backfill',
    },
    // order-service
    orders: {
      list: '/api/v1/admin/orders',
      details: (orderId) => `/api/v1/admin/orders/${orderId}`,
      cancel: (orderId) => `/api/v1/admin/orders/${orderId}/cancel`,
      auditLogs: (orderId) => `/api/v1/admin/orders/${orderId}/audit-logs`,
      customerSummary: (customerId) => `/api/v1/admin/orders/customers/${customerId}/summary`,
      dishRevenue: (menuItemId) => `/api/v1/admin/orders/stats/menu-items/${menuItemId}/revenue`,
      customerTopFoods: (customerId) =>
        `/api/v1/admin/orders/stats/customers/${customerId}/top-foods`,
    },
    // user-service
    users: {
      list: '/api/v1/admin/users',
      details: (userId) => `/api/v1/admin/users/${userId}`,
      activate: (userId) => `/api/v1/admin/users/${userId}/activate`,
      deactivate: (userId) => `/api/v1/admin/users/${userId}/deactivate`,
      role: (userId) => `/api/v1/admin/users/${userId}/role`,
      auditLogs: (userId) => `/api/v1/admin/users/${userId}/audit-logs`,
      addresses: (userId) => `/api/v1/admin/users/${userId}/addresses`,
    },
    // catalog-service
    menuItems: {
      list: '/api/v1/admin/menu-items',
      create: '/api/v1/admin/menu-items',
      update: (itemId) => `/api/v1/admin/menu-items/${itemId}`,
      duplicate: (itemId) => `/api/v1/admin/menu-items/${itemId}/duplicate`,
      categoryStats: '/api/v1/admin/menu-items/category-stats',
      details: (itemId) => `/api/v1/admin/menu-items/${itemId}`,
      activate: (itemId) => `/api/v1/admin/menu-items/${itemId}/activate`,
      block: (itemId) => `/api/v1/admin/menu-items/${itemId}/deactivate`,
      category: (itemId) => `/api/v1/admin/menu-items/${itemId}/category`,
      remove: (itemId) => `/api/v1/admin/menu-items/${itemId}`,
      auditLogs: (itemId) => `/api/v1/admin/menu-items/${itemId}/audit-logs`,
    },
    categories: {
      list: '/api/v1/admin/categories',
      create: '/api/v1/admin/categories',
      update: (categoryId) => `/api/v1/admin/categories/${categoryId}`,
      activate: (categoryId) => `/api/v1/admin/categories/${categoryId}/activate`,
      deactivate: (categoryId) => `/api/v1/admin/categories/${categoryId}/deactivate`,
      remove: (categoryId) => `/api/v1/admin/categories/${categoryId}`,
      order: '/api/v1/admin/categories/order',
      auditLogs: (categoryId) => `/api/v1/admin/categories/${categoryId}/audit-logs`,
    },
    // restaurant-service
    restaurants: {
      list: '/api/v1/admin/restaurants',
      details: (restaurantId) => `/api/v1/admin/restaurants/${restaurantId}`,
      /** approve, reject, activate, deactivate, suspend */
      action: (restaurantId, action) => `/api/v1/admin/restaurants/${restaurantId}/${action}`,
      auditLogs: (restaurantId) => `/api/v1/admin/restaurants/${restaurantId}/audit-logs`,
    },
    // promotion-service
    coupons: {
      list: '/api/v1/admin/coupons',
      create: '/api/v1/admin/coupons',
      details: (couponId) => `/api/v1/admin/coupons/${couponId}`,
      update: (couponId) => `/api/v1/admin/coupons/${couponId}`,
      activate: (couponId) => `/api/v1/admin/coupons/${couponId}/activate`,
      deactivate: (couponId) => `/api/v1/admin/coupons/${couponId}/deactivate`,
      redemptions: (couponId) => `/api/v1/admin/coupons/${couponId}/redemptions`,
      auditLogs: (couponId) => `/api/v1/admin/coupons/${couponId}/audit-logs`,
    },
    // review-service
    reviews: {
      list: '/api/v1/admin/reviews',
      summary: '/api/v1/admin/reviews/summary',
      featuredDishes: '/api/v1/admin/reviews/featured-dishes',
      customerLikedDishes: (customerId) =>
        `/api/v1/admin/reviews/customers/${customerId}/liked-dishes`,
    },
    // payment-service
    payments: {
      list: '/api/v1/admin/payments',
      summary: '/api/v1/admin/payments/summary',
      details: (paymentId) => `/api/v1/admin/payments/${paymentId}`,
      refund: (paymentId) => `/api/v1/admin/payments/${paymentId}/refunds`,
      auditLogs: (paymentId) => `/api/v1/admin/payments/${paymentId}/audit-logs`,
    },
    refunds: {
      list: '/api/v1/admin/refunds',
      details: (refundId) => `/api/v1/admin/refunds/${refundId}`,
    },
    // delivery-service
    deliveries: {
      list: '/api/v1/admin/deliveries',
      delayed: '/api/v1/admin/deliveries/delayed',
      summary: '/api/v1/admin/deliveries/summary',
      details: (deliveryId) => `/api/v1/admin/deliveries/${deliveryId}`,
      reassign: (deliveryId) => `/api/v1/admin/deliveries/${deliveryId}/reassign`,
      auditLogs: (deliveryId) => `/api/v1/admin/deliveries/${deliveryId}/audit-logs`,
    },
    // delivery-partner-service (list, details, activate, deactivate, audit logs) and delivery-service (availability,
    // deliveries): the API Gateway sends each path to its service
    partners: {
      list: '/api/v1/admin/delivery-partners',
      availability: '/api/v1/admin/delivery-partners/availability',
      details: (userId) => `/api/v1/admin/delivery-partners/${userId}`,
      deliveries: (userId) => `/api/v1/admin/delivery-partners/${userId}/deliveries`,
      activate: (userId) => `/api/v1/admin/delivery-partners/${userId}/activate`,
      deactivate: (userId) => `/api/v1/admin/delivery-partners/${userId}/deactivate`,
      auditLogs: (userId) => `/api/v1/admin/delivery-partners/${userId}/audit-logs`,
    },
    // chat-service: the staff's shared inbox
    chat: {
      conversations: '/api/v1/admin/chat/conversations',
      conversation: (id) => `/api/v1/admin/chat/conversations/${id}`,
      messages: (id) => `/api/v1/admin/chat/conversations/${id}/messages`,
      read: (id) => `/api/v1/admin/chat/conversations/${id}/read`,
      pin: (id) => `/api/v1/admin/chat/conversations/${id}/pin`,
      mute: (id) => `/api/v1/admin/chat/conversations/${id}/mute`,
      unreadCount: '/api/v1/admin/chat/unread-count',
    },
    // notification-service
    notifications: {
      list: '/api/v1/admin/notifications',
      summary: '/api/v1/admin/notifications/summary',
      details: (notificationId) => `/api/v1/admin/notifications/${notificationId}`,
      resend: (notificationId) => `/api/v1/admin/notifications/${notificationId}/resend`,
      auditLogs: (notificationId) => `/api/v1/admin/notifications/${notificationId}/audit-logs`,
    },
  },
};

/**
 * Sent with changes that must never happen twice (a refund): retrying with the same key returns the first result
 * instead of refunding again.
 */
export const IDEMPOTENCY_KEY_HEADER = 'Idempotency-Key';

/** The gateway gives every request an id (and sends it back); quote it when reporting a problem. */
export const REQUEST_ID_HEADER = 'x-request-id';
