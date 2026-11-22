import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/utils/apiEndpoints';

/** search-service (Elasticsearch, public): forgives typos and matches the start of words. */
export const searchService = {
  searchRestaurants: (params, page, size) =>
    apiClient.get(API_ENDPOINTS.search.restaurants, { params: { ...params, page, size } }),

  searchFoods: (params, page, size) =>
    apiClient.get(API_ENDPOINTS.search.foods, { params: { ...params, page, size } }),

  /** Up to 5 restaurants, dishes and categories for the search box (text: 1 to 50 characters). */
  suggest: (text) => apiClient.get(API_ENDPOINTS.search.suggest, { params: { q: text } }),
};
