import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useCustomerId } from '@/hooks/api/cartHooks';
import { userService } from '@/services/userService';
import { QUERY_KEYS } from '@/utils/queryKeys';

/** The signed-in customer's addresses (user-service), the default first. */
export function useAddresses() {
  const customerId = useCustomerId();
  return useQuery({
    queryKey: QUERY_KEYS.customer.addresses(customerId),
    queryFn: () => userService.getAddresses(),
    enabled: customerId > 0,
  });
}

/** Any change can move the default to another address: the whole list is asked for again. */
function useAddressMutation(change) {
  const customerId = useCustomerId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: change,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customer.addresses(customerId) }),
  });
}

/** Adds an address, or changes one when addressId is given. */
export function useSaveAddress() {
  return useAddressMutation(({ addressId, request }) =>
    addressId === undefined
      ? userService.addAddress(request)
      : userService.updateAddress(addressId, request),
  );
}

export function useMakeDefaultAddress() {
  return useAddressMutation((addressId) => userService.makeDefaultAddress(addressId));
}

export function useDeleteAddress() {
  return useAddressMutation((addressId) => userService.deleteAddress(addressId));
}
