/** restaurant-service (admin). */

/**
 * Restaurant lifecycle. PENDING (submitted) -> APPROVED or REJECTED (admin review) -> ACTIVE (live) <-> INACTIVE;
 * ACTIVE or INACTIVE -> SUSPENDED (policy problem) -> ACTIVE. A REJECTED restaurant is resubmitted by its owner.
 */
export const RESTAURANT_STATUSES = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
];

/** The admin's status actions and the statuses each one is allowed from (restaurant-service's transition map). */
export const RESTAURANT_ACTIONS = {
  approve: { to: 'APPROVED', from: ['PENDING'] },
  reject: { to: 'REJECTED', from: ['PENDING'] },
  activate: { to: 'ACTIVE', from: ['APPROVED', 'INACTIVE', 'SUSPENDED'] },
  deactivate: { to: 'INACTIVE', from: ['ACTIVE'] },
  suspend: { to: 'SUSPENDED', from: ['ACTIVE', 'INACTIVE'] },
};
