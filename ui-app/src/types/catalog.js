/** catalog-service: menu items ("foods") and categories. */

/**
 * Whether an item is listed. ACTIVE: on the menu; DISABLED: hidden by the owner (who can show it again);
 * BLOCKED: hidden by a platform admin (only an admin can release it).
 */
export const MENU_ITEM_STATUSES = ['ACTIVE', 'DISABLED', 'BLOCKED'];

/** ACTIVE: shown to customers and can be given to dishes. INACTIVE: hidden, and cannot be given to dishes. */
export const CATEGORY_STATUSES = ['ACTIVE', 'INACTIVE'];
