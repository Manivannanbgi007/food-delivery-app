import { axiosInstance } from '@/api/axiosInstance';

/**
 * What services use to call the APIs: one method per HTTP verb, returning the answer's body with its type.
 * Failures are thrown as ApiError (see apiErrorHandler).
 *
 *   const order = await apiClient.get(API_ENDPOINTS.orders.detail(id));
 */
export const apiClient = {
  async get(url, options = {}) {
    const response = await axiosInstance.get(url, options);
    return response.data;
  },

  async post(url, body, options = {}) {
    const response = await axiosInstance.post(url, body, options);
    return response.data;
  },

  async put(url, body, options = {}) {
    const response = await axiosInstance.put(url, body, options);
    return response.data;
  },

  async patch(url, body, options = {}) {
    const response = await axiosInstance.patch(url, body, options);
    return response.data;
  },

  /** 204 No Content answers resolve to undefined. */
  async delete(url, options = {}) {
    const response = await axiosInstance.delete(url, options);
    return response.data;
  },
};
