import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/utils/apiEndpoints';

/** catalog-service APIs: menu items ("foods") and categories (admin), the public menu and categories. */
export const catalogService = {
  /** Public: the active categories, in menu order. */
  getStoreCategories: () => apiClient.get(API_ENDPOINTS.storefront.categories),

  /** Public: a restaurant's menu by category (hidden dishes left out, sold-out ones marked). */
  getRestaurantMenu: (restaurantId) => apiClient.get(API_ENDPOINTS.storefront.menu(restaurantId)),

  /** Menu items of every restaurant matching the filters, one page (page 0 = the first). */
  searchMenuItems: (filters, page, size) =>
    apiClient.get(API_ENDPOINTS.admin.menuItems.list, {
      params: { ...filters, page, size },
    }),

  getMenuItem: (itemId) => apiClient.get(API_ENDPOINTS.admin.menuItems.details(itemId)),

  /** A new menu item for a restaurant. 409 when the restaurant already has a dish of that name. */
  createMenuItem: (item) => apiClient.post(API_ENDPOINTS.admin.menuItems.create, item),

  /** Edit a menu item (all fields are replaced). 409 when `version` is stale or the name is taken. */
  updateMenuItem: (itemId, item) =>
    apiClient.put(API_ENDPOINTS.admin.menuItems.update(itemId), item),

  /** A copy named "<name> (copy)", hidden (DISABLED). */
  duplicateMenuItem: (itemId) => apiClient.post(API_ENDPOINTS.admin.menuItems.duplicate(itemId)),

  /** The categories with the most dishes, and how many of their dishes can be ordered now. */
  getCategoryStats: (limit) =>
    apiClient.get(API_ENDPOINTS.admin.menuItems.categoryStats, {
      params: { limit },
    }),

  /**
   * Activate: list the item again (also releases a BLOCKED item). Block: hide it; the owner cannot show it again.
   * Both audited.
   */
  changeStatus: (itemId, activate, reason) =>
    apiClient.put(
      activate
        ? API_ENDPOINTS.admin.menuItems.activate(itemId)
        : API_ENDPOINTS.admin.menuItems.block(itemId),
      { reason },
    ),

  changeCategory: (itemId, categoryId, reason) =>
    apiClient.put(API_ENDPOINTS.admin.menuItems.category(itemId), { categoryId, reason }),

  /** Remove an invalid item (only one that is not listed). Past orders keep their own copy of it. */
  removeMenuItem: (itemId, reason) =>
    apiClient.delete(API_ENDPOINTS.admin.menuItems.remove(itemId), { params: { reason } }),

  getAuditLogs: (itemId) =>
    apiClient.get(API_ENDPOINTS.admin.menuItems.auditLogs(itemId), {
      params: { size: 50 },
    }),

  /** Every category (active and inactive), in menu order, with how many dishes use it. */
  getCategories: async () => {
    const page = await apiClient.get(API_ENDPOINTS.admin.categories.list, {
      params: { size: 100, sort: 'displayOrder' },
    });
    return page.content;
  },

  /** A new category: ACTIVE, at the end of the menu order. 409 when the name exists (any letter case). */
  createCategory: (category) => apiClient.post(API_ENDPOINTS.admin.categories.create, category),

  /** Rename or describe a category (all three fields are replaced). */
  updateCategory: (categoryId, category) =>
    apiClient.put(API_ENDPOINTS.admin.categories.update(categoryId), category),

  /** Inactive: hidden from customers and cannot be given to dishes; dishes keep it. Audited. */
  changeCategoryStatus: (categoryId, activate, reason) =>
    apiClient.put(
      activate
        ? API_ENDPOINTS.admin.categories.activate(categoryId)
        : API_ENDPOINTS.admin.categories.deactivate(categoryId),
      { reason },
    ),

  /** Only a category no dish uses (409 otherwise). */
  removeCategory: (categoryId, reason) =>
    apiClient.delete(API_ENDPOINTS.admin.categories.remove(categoryId), { params: { reason } }),

  /** The new menu order: every category id (also inactive ones) exactly once. */
  reorderCategories: (categoryIds) =>
    apiClient.put(API_ENDPOINTS.admin.categories.order, { categoryIds }),

  getCategoryAuditLogs: (categoryId) =>
    apiClient.get(API_ENDPOINTS.admin.categories.auditLogs(categoryId), {
      params: { size: 50 },
    }),
};
