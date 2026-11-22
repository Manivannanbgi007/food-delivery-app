import { USER_ROLES } from '@/types/user';
import { OWNER_BASE, PARTNER_BASE, ROUTES } from '@/utils/constants';
import { logger } from '@/utils/logger';

/**
 * The application has four areas: the admin area (/admin/...), the restaurant owner's area (/owner/...), the
 * delivery partner's area (/partner/...) and the customer area (every other address).
 * The area decides who the application acts as: the person who signed in to that area, with that area's access
 * token. Because the address decides, a page never sends another area's user, even right after moving from one area
 * to the other.
 */

/**
 * The kind of account each area is for. user-service keeps one sign-in session (refresh cookie) per role, so the
 * four areas can be signed in at the same time in one browser.
 */
export const AREA_ROLES = {
  customer: 'CUSTOMER',
  owner: 'RESTAURANT_ADMIN',
  partner: 'DELIVERY_PARTNER',
  admin: 'PLATFORM_ADMIN',
};

/** The area a kind of account signs in to (each role has exactly one). */
export function areaOfRole(role) {
  const area = Object.keys(AREA_ROLES).find((candidate) => AREA_ROLES[candidate] === role);
  return area ?? 'customer';
}

function isInside(pathname, base) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function areaOf(pathname) {
  if (isInside(pathname, ROUTES.admin)) {
    return 'admin';
  }
  if (isInside(pathname, PARTNER_BASE)) {
    return 'partner';
  }
  return isInside(pathname, OWNER_BASE) ? 'owner' : 'customer';
}

export function actingUserOf(session, area) {
  switch (area) {
    case 'admin':
      return session.adminUser;
    case 'owner':
      return session.owner ?? null;
    case 'partner':
      return session.partner ?? null;
    default:
      return session.customer;
  }
}

/** Who signed in to each area is kept for the browser tab (sessionStorage): a reload keeps them signed in. */
const CUSTOMER_KEY = 'front-app.customer';
const OWNER_KEY = 'front-app.owner';
const PARTNER_KEY = 'front-app.partner';
const ADMIN_KEY = 'front-app.admin';

function loadSession(key) {
  try {
    const saved = sessionStorage.getItem(key);
    if (!saved) {
      return null;
    }
    const value = JSON.parse(saved);
    const valid =
      Number.isInteger(value.id) &&
      (value.id ?? 0) > 0 &&
      USER_ROLES.includes(value.role) &&
      typeof value.fullName === 'string' &&
      typeof value.email === 'string';
    return valid ? value : null;
  } catch (error) {
    // Storage blocked (private window, site data blocked) or damaged: start signed out
    logger.debug('The saved sign-in could not be read', error);
    return null;
  }
}

function saveSession(key, user) {
  try {
    if (user) {
      sessionStorage.setItem(key, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(key);
    }
  } catch (error) {
    // Without storage the sign-in still works until the page is reloaded
    logger.debug('The sign-in could not be saved', error);
  }
}

export const loadSignedInCustomer = () => loadSession(CUSTOMER_KEY);
export const saveSignedInCustomer = (customer) => saveSession(CUSTOMER_KEY, customer);
export const loadSignedInAdmin = () => loadSession(ADMIN_KEY);
export const saveSignedInAdmin = (admin) => saveSession(ADMIN_KEY, admin);
export const loadSignedInOwner = () => loadSession(OWNER_KEY);
export const saveSignedInOwner = (owner) => saveSession(OWNER_KEY, owner);
export const loadSignedInPartner = () => loadSession(PARTNER_KEY);
export const saveSignedInPartner = (partner) => saveSession(PARTNER_KEY, partner);
