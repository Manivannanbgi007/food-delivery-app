import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import { toApiError } from '@/api/apiErrorHandler';
import { usePartnerId } from '@/hooks/api/partnerHooks';
import { partnerService } from '@/services/partnerService';
import { geolocationSupport, PERMISSION_DENIED } from '@/utils/geolocationUtils';
import {
  isOnTheWay,
  MAX_QUIET_MS,
  shouldSendPosition,
  toLocationUpdate,
} from '@/utils/liveLocationUtils';
import { QUERY_KEYS } from '@/utils/queryKeys';

/**
 * Fresh positions only (at most 5 s old), the phone's GPS rather than a rough network guess, and an error after 20 s
 * without one (the watch keeps going).
 */
const POSITION_OPTIONS = {
  enableHighAccuracy: true,
  maximumAge: 5_000,
  timeout: 20_000,
};

/**
 * Shares the partner's GPS position with delivery-service while `delivery` is on its way (accepted, then picked
 * up): the browser asks the partner for location access, then the phone's positions are sent, throttled
 * (shouldSendPosition). Sharing stops by itself once the delivery is delivered or cancelled, or the page closes.
 * Positions are never written to the console or kept in the browser.
 */
export function useShareLiveLocation(delivery) {
  const queryClient = useQueryClient();
  const partnerId = usePartnerId();
  const [support] = useState(geolocationSupport);
  const [attempt, setAttempt] = useState(0);
  const [report, setReport] = useState(null);
  const deliveryId = delivery && isOnTheWay(delivery.status) ? delivery.id : null;
  const watch = `${deliveryId}-${attempt}`;

  useEffect(() => {
    if (deliveryId === null || support !== 'ok') {
      return;
    }
    const { geolocation } = navigator;
    let last = null;
    let sending = false;
    let denied = false;
    let stopped = false;

    const show = (state, sentAt) => {
      if (!stopped) {
        setReport((previous) => ({
          watch,
          state,
          lastSentAt: sentAt ?? (previous?.watch === watch ? previous.lastSentAt : null),
        }));
      }
    };

    const onPosition = async (position) => {
      const point = { lat: position.coords.latitude, lng: position.coords.longitude };
      const now = Date.now();
      if (sending || stopped || !shouldSendPosition(last, point, now)) {
        return;
      }
      sending = true;
      // A failed attempt counts too: the next one waits as long as after a success
      last = { point, at: now };
      try {
        await partnerService.shareLocation(deliveryId, toLocationUpdate(position.coords));
        show('sharing', Date.now());
      } catch (error) {
        const { kind } = toApiError(error);
        if (kind === 'conflict' || kind === 'notFound') {
          // The delivery is no longer on its way (delivered, cancelled, given to someone else): the pages ask again
          // and sharing stops
          void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partnerArea.all(partnerId) });
        } else if (kind !== 'tooManyRequests') {
          show('retrying');
        }
      } finally {
        sending = false;
      }
    };

    const onError = (error) => {
      denied = error.code === PERMISSION_DENIED;
      show(denied ? 'denied' : 'unavailable');
    };

    const handlePosition = (position) => void onPosition(position);
    const watchId = geolocation.watchPosition(handlePosition, onError, POSITION_OPTIONS);
    // A phone standing still may report nothing new for a long time: it is asked again, so the customer keeps
    // seeing a fresh position
    const timer = window.setInterval(() => {
      if (!denied && (!last || Date.now() - last.at >= MAX_QUIET_MS)) {
        geolocation.getCurrentPosition(handlePosition, onError, POSITION_OPTIONS);
      }
    }, MAX_QUIET_MS);

    return () => {
      stopped = true;
      geolocation.clearWatch(watchId);
      window.clearInterval(timer);
    };
  }, [deliveryId, support, watch, partnerId, queryClient]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  if (deliveryId === null) {
    return { state: 'off', deliveryId: null, lastSentAt: null, retry };
  }
  const current = report?.watch === watch ? report : null;
  return {
    state: support === 'ok' ? (current?.state ?? 'starting') : support,
    deliveryId,
    lastSentAt: current?.lastSentAt ?? null,
    retry,
  };
}
