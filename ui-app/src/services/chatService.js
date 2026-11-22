import { toApiError } from '@/api/apiErrorHandler';
import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/utils/apiEndpoints';

/** How many messages one page holds. */
export const CHAT_PAGE_SIZE = 30;

/** chat-service APIs. The participant's own conversation, and (platform admins) the shared support inbox. */
export const chatService = {
  /** The participant's conversation with Support; null when they have not written yet (404). */
  getMyConversation: async () => {
    try {
      return await apiClient.get(API_ENDPOINTS.chat.conversation);
    } catch (error) {
      if (toApiError(error).kind === 'notFound') {
        return null;
      }
      throw error;
    }
  },

  getMyMessages: ({ beforeId } = {}) =>
    apiClient.get(API_ENDPOINTS.chat.messages, {
      params: { beforeId, limit: CHAT_PAGE_SIZE },
    }),

  /** The same clientMessageId again returns the same message (a retry never duplicates). */
  sendMyMessage: (request) => apiClient.post(API_ENDPOINTS.chat.messages, request),

  markMyConversationRead: () => apiClient.post(API_ENDPOINTS.chat.read),

  /** Staff: conversations, pinned first then the newest. */
  getConversations: (search, page, size) =>
    apiClient.get(API_ENDPOINTS.admin.chat.conversations, {
      params: { search: search || undefined, page, size },
    }),

  /** Opens the conversation with a user (created when there is none yet). */
  startConversation: (userId) => apiClient.post(API_ENDPOINTS.admin.chat.conversations, { userId }),

  getConversation: (conversationId) =>
    apiClient.get(API_ENDPOINTS.admin.chat.conversation(conversationId)),

  getMessages: (conversationId, { beforeId, q } = {}) =>
    apiClient.get(API_ENDPOINTS.admin.chat.messages(conversationId), {
      params: { beforeId, limit: CHAT_PAGE_SIZE, q: q || undefined },
    }),

  sendMessage: (conversationId, request) =>
    apiClient.post(API_ENDPOINTS.admin.chat.messages(conversationId), request),

  markRead: (conversationId) => apiClient.post(API_ENDPOINTS.admin.chat.read(conversationId)),

  setPinned: (conversationId, pinned) =>
    apiClient.put(API_ENDPOINTS.admin.chat.pin(conversationId), { pinned }),

  setMuted: (conversationId, muted) =>
    apiClient.put(API_ENDPOINTS.admin.chat.mute(conversationId), { muted }),

  /** How many conversations have messages the staff has not read. */
  getUnreadCount: async () => {
    const response = await apiClient.get(API_ENDPOINTS.admin.chat.unreadCount);
    return response.count;
  },
};
