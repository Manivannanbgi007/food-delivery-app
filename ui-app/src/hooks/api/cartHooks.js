import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { orderService } from '@/services/orderService';
import { useAppSelector } from '@/store/hooks';
import { selectCustomer } from '@/store/slices/sessionSlice';
import { QUERY_KEYS } from '@/utils/queryKeys';

/** The signed-in customer's id (0 = nobody: their queries wait). Customer data is kept per customer. */
export function useCustomerId() {
  return useAppSelector(selectCustomer)?.id ?? 0;
}

/** The cart, for the signed-in customer only (the header's count, the cart page, checkout). */
export function useCart() {
  const customerId = useCustomerId();
  return useQuery({
    queryKey: QUERY_KEYS.customer.cart(customerId),
    queryFn: () => orderService.getCart(),
    enabled: customerId > 0,
  });
}

/** Every cart change answers with the whole cart (fresh prices, coupon, problems): it replaces the cached one. */
function useCartMutation(change) {
  const customerId = useCustomerId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: change,
    onSuccess: (cart) => queryClient.setQueryData(QUERY_KEYS.customer.cart(customerId), cart),
  });
}

export function useSetCartQuantity() {
  return useCartMutation(({ menuItemId, quantity }) =>
    orderService.setCartQuantity(menuItemId, quantity),
  );
}

export function useRemoveFromCart() {
  return useCartMutation((menuItemId) => orderService.removeFromCart(menuItemId));
}

export function useApplyCoupon() {
  return useCartMutation((code) => orderService.applyCoupon(code));
}

export function useRemoveCoupon() {
  return useCartMutation(() => orderService.removeCoupon());
}

export function useClearCart() {
  const customerId = useCustomerId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => orderService.clearCart(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customer.cart(customerId) }),
  });
}

/**
 * Checkout. The new order is cached at once; the cart, emptied by the server, is asked for again in the
 * background (not awaited: the page moves on to the payment first).
 */
export function usePlaceOrder() {
  const customerId = useCustomerId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ request, idempotencyKey }) => orderService.placeOrder(request, idempotencyKey),
    onSuccess: (order) => {
      queryClient.setQueryData(QUERY_KEYS.customer.order(customerId, order.id), order);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customer.cart(customerId) });
    },
  });
}
