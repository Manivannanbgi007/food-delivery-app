import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/utils/apiEndpoints';

/** review-service's public ratings: what visitors and customers see on restaurants and dishes. */
export const ratingService = {
  /** The ratings of up to 100 restaurants at once; restaurants without reviews are not in the answer. */
  getRestaurantRatings: (ids) =>
    apiClient.get(API_ENDPOINTS.ratings.restaurants, {
      params: { ids: ids.join(',') },
    }),

  /** The ratings of up to 100 dishes at once; dishes without ratings are not in the answer. */
  getDishRatings: (ids) =>
    apiClient.get(API_ENDPOINTS.ratings.menuItems, {
      params: { ids: ids.join(',') },
    }),

  /** One restaurant: average, count and how many gave 1 to 5 stars (count 0 while nobody has rated it). */
  getRestaurantRating: (restaurantId) =>
    apiClient.get(API_ENDPOINTS.ratings.restaurant(restaurantId)),

  /** One dish: average, count and how many gave 1 to 5 stars. */
  getDishRating: (menuItemId) => apiClient.get(API_ENDPOINTS.ratings.menuItem(menuItemId)),

  /** One page of a restaurant's reviews (page 0 = the first). */
  getRestaurantReviews: (restaurantId, sort, page, size) =>
    apiClient.get(API_ENDPOINTS.ratings.restaurantReviews(restaurantId), {
      params: { sort, page, size },
    }),

  /**
   * One page of the reviews that rated a dish, newest first: each customer's comment and tags on the order, and the
   * stars every rated dish got (the reviewer's name is shortened, as on the restaurant's reviews).
   */
  getDishReviews: (menuItemId, page, size) =>
    apiClient.get(API_ENDPOINTS.ratings.menuItemReviews(menuItemId), {
      params: { page, size },
    }),
};
