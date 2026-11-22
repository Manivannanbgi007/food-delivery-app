import { ADMIN_CANCELLABLE_STATUSES } from '@/types/order';

/**
 * The actions this user is offered for this order, in the order of the menu. Only what the platform supports:
 * look at the order, read its history, see its online payments, open its customer and, while the order is not yet
 * on its way to being finished, cancel it (a platform admin's audited intervention). The order service checks all of
 * it again (role and status) when an action is sent, so this only decides what is shown.
 *
 * There is no "edit the status" and no "delete": an order's status moves only through its workflow (the
 * restaurant, the delivery partner, the customer, an admin's cancel), and an order record is never deleted.
 */
export function orderActionsFor(order, role) {
  if (role !== 'PLATFORM_ADMIN') {
    return [];
  }
  const actions = ['open', 'history'];
  if (order.paymentMethod !== 'CASH_ON_DELIVERY') {
    actions.push('payments');
  }
  actions.push('customer');
  if (ADMIN_CANCELLABLE_STATUSES.includes(order.status)) {
    actions.push('cancel');
  }
  return actions;
}
