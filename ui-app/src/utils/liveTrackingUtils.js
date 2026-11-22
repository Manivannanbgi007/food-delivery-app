import { orderProgress } from '@/utils/shoppingUtils';
import { orderStatusProgress } from '@/utils/statusProgressUtils';

/** The order status a live phase proves: the food picked up means on the way; at the door means delivered. */
const STATUS_PROVEN_BY_PHASE = {
  TO_CUSTOMER: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
};

/**
 * Where the order stands beside the live map. The order's own status (order-service, saved with each step) decides;
 * the delivery (delivery-service) may be a moment ahead, since order-service hears about a pickup or a delivery
 * through an event a moment later. Then the further of the two counts, so the steps never contradict the map. A
 * cancelled or rejected order stays as it is.
 */
export function trackedOrderStatus(orderStatus, phase) {
  const proven = phase ? STATUS_PROVEN_BY_PHASE[phase] : undefined;
  const order = orderStatusProgress({ status: orderStatus });
  if (!proven || order.final) {
    return orderStatus;
  }
  return orderStatusProgress({ status: proven }).step > order.step ? proven : orderStatus;
}

/**
 * The steps of the order (placed, accepted, preparing, ready, on the way, delivered) with when each was reached,
 * as the order page shows them: from the order's saved status and timeline, never from the simulated ride.
 */
export function trackingSteps(order, phase) {
  return orderProgress({
    status: trackedOrderStatus(order.status, phase),
    timeline: order.timeline,
  });
}

/** The positions and arrival time are sample data (a demo), not the partner's real GPS position. */
export function isSimulated(tracking) {
  return tracking.source === 'SIMULATED';
}

/**
 * Everything the map can really show: the partner's position (once their phone has sent one) and the places that
 * have map coordinates. Empty means there is nothing to draw yet.
 */
export function mapPoints(tracking) {
  return [tracking.rider?.location, tracking.restaurant.location, tracking.dropoff.location].filter(
    (point) => Boolean(point),
  );
}

/** The map frames the partner and where they ride to (or both places once delivered), from what is known. */
export function framingPoints(tracking) {
  const rider = tracking.rider?.location;
  const { restaurant, dropoff } = tracking;
  let points;
  switch (tracking.phase) {
    case 'DELIVERED':
      points = [restaurant.location, dropoff.location];
      break;
    case 'TO_CUSTOMER':
      points = [rider, dropoff.location];
      break;
    default:
      points = [rider, restaurant.location, dropoff.location];
  }
  const known = points.filter((point) => Boolean(point));
  return known.length > 0 ? known : mapPoints(tracking);
}
