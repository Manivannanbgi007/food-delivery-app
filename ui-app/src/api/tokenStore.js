/**
 * The access tokens of the four areas, in memory only: never in localStorage or sessionStorage, where any script on
 * the page could read them. A reload forgets them; the first request after it gets a new one with the area's
 * refresh cookie (api/sessionRefresh.js), so the person stays signed in.
 */
const tokens = new Map();

export const tokenStore = {
  get: (area) => tokens.get(area) ?? null,
  set: (area, token) => {
    tokens.set(area, token);
  },
  clear: (area) => {
    tokens.delete(area);
  },
  clearAll: () => {
    tokens.clear();
  },
};

/** The token of a sign-in or refresh answer. */
export function tokenOf(session, now = Date.now()) {
  return {
    value: session.accessToken,
    expiresAt: now + session.expiresIn * 1000,
    userId: session.userId,
  };
}
