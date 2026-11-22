/** review-service: customers rate delivered orders (the order, its dishes), admins read the reviews. */

export const REVIEW_TAGS = [
  'DELICIOUS',
  'EXCELLENT',
  'GOOD_SERVICE',
  'FAST_DELIVERY',
  'GOOD_VALUE',
  'GOOD_PACKAGING',
];

/** The window of a customer's liked dishes. Ratings are sparse, so "all time" replaces a daily view. */
export const LIKED_DISHES_PERIODS = ['ALL', 'MONTHLY', 'WEEKLY'];
