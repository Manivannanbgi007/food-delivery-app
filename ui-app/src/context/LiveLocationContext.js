import { createContext, useContext } from 'react';

/**
 * How sharing the partner's position goes:
 * off: no delivery on its way, nothing is shared; starting: waiting for the phone's first position; sharing: the
 * last position reached the platform; retrying: the last one could not be sent (it is tried again with the next);
 * denied: the browser blocks location for this site; unavailable: the phone cannot find its position (no signal);
 * unsupported: the browser has no location; insecure: the page is not on https (browsers share a position only
 * there and on localhost).
 */

export const LIVE_LOCATION_OFF = {
  state: 'off',
  deliveryId: null,
  lastSentAt: null,
  retry: () => undefined,
};

/** Filled by the partner area (PartnerLiveLocation); outside it nothing is shared. */
export const LiveLocationContext = createContext(LIVE_LOCATION_OFF);

/** UI state (React Context): whether the partner's live position is being shared, for any page of the area. */
export function useLiveLocationSharing() {
  return useContext(LiveLocationContext);
}
