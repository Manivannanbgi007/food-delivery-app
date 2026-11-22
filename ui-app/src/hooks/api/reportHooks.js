import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { reportService } from '@/services/reportService';
import { QUERY_KEYS } from '@/utils/queryKeys';

/** Reports add up a whole period: kept for a few minutes instead of asked again on every visit. */
const REPORT_STALE_MS = 2 * 60_000;

// While another period loads, the previous report stays on the screen (placeholderData).
const reportOptions = { placeholderData: keepPreviousData, staleTime: REPORT_STALE_MS };

export function useOrderReport(params) {
  return useQuery({
    queryKey: QUERY_KEYS.reports.orders(params),
    queryFn: () => reportService.getOrderReport(params),
    ...reportOptions,
  });
}

export function useRevenueReport(params, groupBy) {
  return useQuery({
    queryKey: QUERY_KEYS.reports.revenue(params, groupBy),
    queryFn: () => reportService.getRevenueReport(params, groupBy),
    ...reportOptions,
  });
}

export function useRestaurantReport(params) {
  return useQuery({
    queryKey: QUERY_KEYS.reports.restaurants(params),
    queryFn: () => reportService.getRestaurantReport(params),
    ...reportOptions,
  });
}

export function useCustomerReport(params) {
  return useQuery({
    queryKey: QUERY_KEYS.reports.customers(params),
    queryFn: () => reportService.getCustomerReport(params),
    ...reportOptions,
  });
}

export function useDeliveryReport(params) {
  return useQuery({
    queryKey: QUERY_KEYS.reports.deliveries(params),
    queryFn: () => reportService.getDeliveryReport(params),
    ...reportOptions,
  });
}
