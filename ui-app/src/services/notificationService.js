import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/utils/apiEndpoints';

/** notification-service APIs: the acting user's inbox, and (admin) every notification. */
export const notificationService = {
  /** How many of the acting user's in-app notifications are unread (the number on the bell). */
  getUnreadCount: async () => {
    const response = await apiClient.get(API_ENDPOINTS.notifications.unreadCount);
    return response.unread;
  },

  /** The acting user's in-app notifications, newest first. */
  getInbox: (unreadOnly, page, size) =>
    apiClient.get(API_ENDPOINTS.notifications.list, {
      params: { unreadOnly, page, size },
    }),

  /** Marking twice keeps the first time it was read. */
  markRead: (notificationId) => apiClient.put(API_ENDPOINTS.notifications.markRead(notificationId)),

  markAllRead: () => apiClient.put(API_ENDPOINTS.notifications.markAllRead),

  searchNotifications: (filters, page, size) =>
    apiClient.get(API_ENDPOINTS.admin.notifications.list, {
      params: { ...filters, page, size },
    }),

  /** Totals per status and channel; without dates: today. */
  getSummary: (fromDate, toDate) =>
    apiClient.get(API_ENDPOINTS.admin.notifications.summary, {
      params: { fromDate, toDate },
    }),

  getNotification: (notificationId) =>
    apiClient.get(API_ENDPOINTS.admin.notifications.details(notificationId)),

  /** Sends a FAILED or SKIPPED notification again, with all its attempts. Audited. */
  resend: (notificationId, reason) =>
    apiClient.post(API_ENDPOINTS.admin.notifications.resend(notificationId), {
      reason,
    }),

  getAuditLogs: (notificationId) =>
    apiClient.get(API_ENDPOINTS.admin.notifications.auditLogs(notificationId), {
      params: { size: 50 },
    }),
};
