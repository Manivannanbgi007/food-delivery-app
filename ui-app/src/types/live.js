/**
 * What the live connection (WebSocket, notification-service) sends: a small "something changed" hint, never data
 * about people. The application then reads the current data through the REST APIs, which check what the user may see.
 */
export const LIVE_EVENT_TYPES = [
  'ORDER_STATUS_CHANGED',
  'ORDER_CANCELLED',
  'PAYMENT_STATUS_CHANGED',
  'DELIVERY_STATUS_CHANGED',
  'RESTAURANT_CHANGED',
  'CHAT_MESSAGE',
  'CHAT_READ',
];
