import { PAYMENT_METHOD_LABELS } from '@/utils/constants';
import { humanizeEnum } from '@/utils/formatUtils';

/** A work status as the partner says it ("Online", where the admin pages say "Available"). */
export const PARTNER_STATUS_WORDS = {
  AVAILABLE: 'Online',
  BUSY: 'On a delivery',
  OFFLINE: 'Offline',
  SUSPENDED: 'Suspended',
};

/** "ka01ab1234" -> "KA 01 AB 1234": a number plate as it is printed (a space where letters and digits meet). */
export function plateTextOf(value) {
  return value
    .toUpperCase()
    .replaceAll(/[^A-Z0-9]/g, '')
    .replaceAll(/([A-Z])(?=\d)|(\d)(?=[A-Z])/g, '$1$2 ');
}

/**
 * How long a partner has to accept an offer: delivery-service's DELIVERY_ACCEPT_TIMEOUT (2 minutes unless the
 * platform changed it). After that the offer goes to another partner and the partner is set offline.
 */
export const OFFER_ACCEPT_SECONDS = 120;

/** "12 MG Road, Indiranagar, Bengaluru 560038" (the parts that are known). */
export function formatDeliveryAddress(address) {
  if (!address) {
    return null;
  }
  const street = [address.line1, address.line2].filter(Boolean).join(', ');
  const town = [address.city, address.postalCode].filter(Boolean).join(' ');
  return [street, town].filter(Boolean).join(', ') || null;
}

/** A link that opens the address in a maps app (the phone's own one, or the browser's). */
export function mapsLinkOf(address) {
  const text = formatDeliveryAddress(address);
  return text
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`
    : null;
}

/**
 * Seconds left to accept an offer made at `assignedAt` (0 once the time is up: delivery-service will take it back
 * at its next run). Null when the delivery is not an open offer.
 */
export function offerSecondsLeft(delivery, now) {
  if (delivery.status !== 'ASSIGNED' || !delivery.assignedAt) {
    return null;
  }
  const deadline = new Date(delivery.assignedAt).getTime() + OFFER_ACCEPT_SECONDS * 1000;
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

/** "1:05" */
export function formatCountdown(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

/** "Paid online (UPI)": how an order with no cash to collect was paid. */
export function paidOnlineLabel(paymentMethod) {
  if (!paymentMethod) {
    return 'Paid online';
  }
  const known = PAYMENT_METHOD_LABELS;
  return `Paid online (${known[paymentMethod] ?? humanizeEnum(paymentMethod)})`;
}

/** Whole minutes from one moment to another (0 when the second is not later). */
export function minutesBetween(fromIso, toIso) {
  return Math.max(0, Math.round((Date.parse(toIso) - Date.parse(fromIso)) / 60_000));
}

/** Cash on delivery: the partner collects money at the door. */
export function collectsCash(delivery) {
  return (delivery.cashToCollect ?? 0) > 0;
}

/** The partner's next step for a delivery in this status (null: nothing to do, or not theirs any more). */
export function nextPartnerStep(status) {
  switch (status) {
    case 'ASSIGNED':
      return 'accept';
    case 'ACCEPTED':
      return 'pickup';
    case 'PICKED_UP':
      return 'deliver';
    default:
      return null;
  }
}

/** The steps a partner goes through, in order, with the status that means the step is done. */
export const PARTNER_JOURNEY = [
  { status: 'ASSIGNED', label: 'Offered' },
  { status: 'ACCEPTED', label: 'Accepted' },
  { status: 'PICKED_UP', label: 'Picked up' },
  { status: 'DELIVERED', label: 'Delivered' },
];

/** How far along the journey a delivery is (index into PARTNER_JOURNEY; -1 before an offer). */
export function journeyStepOf(status) {
  return PARTNER_JOURNEY.findIndex((step) => step.status === status);
}

/** "Good morning" / "Good afternoon" / "Good evening", by the hour of the day (0-23). */
export function greetingOf(hour) {
  if (hour < 12) {
    return 'Good morning';
  }
  return hour < 17 ? 'Good afternoon' : 'Good evening';
}

/** How long the partner has been online: "just now", "12 min", "1 h 05 min". Null without a start. */
export function onlineForLabel(availableSince, now) {
  if (!availableSince) {
    return null;
  }
  const minutes = Math.max(0, Math.floor((now - new Date(availableSince).getTime()) / 60_000));
  if (minutes < 1) {
    return 'just now';
  }
  if (minutes < 60) {
    return `${minutes} min`;
  }
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')} min`;
}

/** The day a history row belongs to ('Today', 'Yesterday', or '8 Oct 2026'), in the viewer's time zone. */
export function dayLabelOf(isoInstant, now = new Date()) {
  const day = new Date(isoInstant);
  const startOf = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const daysAgo = Math.round((startOf(now) - startOf(day)) / 86_400_000);
  if (daysAgo === 0) {
    return 'Today';
  }
  if (daysAgo === 1) {
    return 'Yesterday';
  }
  return day.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
