import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { paymentService } from '@/services/paymentService';
import { QUERY_KEYS } from '@/utils/queryKeys';

/** One page of payments; enabled = false while a filter is invalid. */
export function usePayments(filters, page, size, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.payments.list(filters, page, size),
    queryFn: () => paymentService.searchPayments(filters, page, size),
    placeholderData: keepPreviousData,
    enabled,
  });
}

/** Totals per status and method for a period (no dates: today). */
export function usePaymentSummary(fromDate, toDate, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.payments.summary(fromDate, toDate),
    queryFn: () => paymentService.getSummary(fromDate, toDate),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function usePayment(paymentId) {
  return useQuery({
    queryKey: QUERY_KEYS.payments.details(paymentId),
    queryFn: () => paymentService.getPayment(paymentId),
  });
}

export function usePaymentAuditLogs(paymentId) {
  return useQuery({
    queryKey: QUERY_KEYS.payments.auditLogs(paymentId),
    queryFn: () => paymentService.getAuditLogs(paymentId),
  });
}

/** Refunds a payment; afterwards payments, refunds, the dashboard and the payment's order are reloaded. */
export function useRefundPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, amount, reason, idempotencyKey }) =>
      paymentService.refundPayment(paymentId, amount, reason, idempotencyKey),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.payments.all }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.refunds.all }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboardAll }),
      ]);
    },
  });
}

/** One page of refunds; enabled = false while a filter is invalid. */
export function useRefunds(filters, page, size, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.refunds.list(filters, page, size),
    queryFn: () => paymentService.searchRefunds(filters, page, size),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useRefund(refundId) {
  return useQuery({
    queryKey: QUERY_KEYS.refunds.details(refundId),
    queryFn: () => paymentService.getRefund(refundId),
  });
}

/** Whether online payments use Razorpay Checkout here; it only changes when payment-service is reconfigured. */
export function useRazorpayConfig() {
  return useQuery({
    queryKey: QUERY_KEYS.storefront.razorpayConfig,
    queryFn: () => paymentService.getRazorpayConfig(),
    staleTime: 10 * 60_000,
  });
}

/** Creates (or reopens) the Razorpay order of an order: what Checkout is opened with. */
export function useStartRazorpayCheckout() {
  return useMutation({
    mutationFn: (orderId) => paymentService.startRazorpayCheckout(orderId),
  });
}

/** Confirms a Checkout payment on the server (signature + Razorpay's own record); never trusted from the browser. */
export function useVerifyRazorpayPayment() {
  return useMutation({
    mutationFn: (request) => paymentService.verifyRazorpayPayment(request),
  });
}

/**
 * A customer pays an order. A declined payment resolves too (status FAILED with the reason); only a request the
 * service refused or could not answer rejects.
 */
export function usePayOrder() {
  return useMutation({
    mutationFn: ({ request, idempotencyKey }) => paymentService.payOrder(request, idempotencyKey),
  });
}
