/**
 * admin-service reports (GET /api/v1/admin/reports/...). Each covers calendar days in the business time zone
 * (both included, at most 366). The figures of a service that did not answer are null (lists: empty) and the
 * service is named in `unavailable`: never show those as zero. Amounts are numbers in `currency`.
 */

/** The order-frequency buckets, always all four, in this order. */
export const ORDER_FREQUENCY_BUCKETS = ['1', '2-3', '4-5', '6+'];
