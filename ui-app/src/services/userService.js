import { apiClient } from '@/api/apiClient';
import { sessionApi } from '@/api/sessionApi';
import { API_ENDPOINTS } from '@/utils/apiEndpoints';

/** user-service APIs. */
export const userService = {
  /** A new customer account (409 when the email or phone is already registered). */
  register: (request) => apiClient.post(API_ENDPOINTS.auth.register, request),

  /**
   * Signs in to one area (`role`: the kind of account it is for): an access token comes back and the browser keeps
   * the area's refresh cookie. 401 "Invalid email or password", 403 for a deactivated account, and 403 with code
   * WRONG_ACCOUNT_TYPE for an account of another kind.
   */
  login: (email, password, role) => sessionApi.login(email, password, role),

  /** The signed-in customer's addresses, the default first (at most 10). */
  getAddresses: () => apiClient.get(API_ENDPOINTS.users.addresses),

  /** The first address becomes the default; makeDefault moves the default to the new one. */
  addAddress: (request) => apiClient.post(API_ENDPOINTS.users.addresses, request),

  updateAddress: (addressId, request) =>
    apiClient.put(API_ENDPOINTS.users.address(addressId), request),

  makeDefaultAddress: (addressId) => apiClient.put(API_ENDPOINTS.users.defaultAddress(addressId)),

  /** Orders keep their own copy of the address, so any address can be deleted. */
  deleteAddress: (addressId) => apiClient.delete(API_ENDPOINTS.users.address(addressId)),

  /** Changes the signed-in user's name and phone (409 when the phone belongs to another account). */
  updateMyProfile: (request) => apiClient.put(API_ENDPOINTS.users.me, request),

  /** 422 when the current password is wrong or the new one is the same. */
  changeMyPassword: (request) => apiClient.put(API_ENDPOINTS.users.password, request),

  /** The acting user's own profile (name for the header greeting). */
  getMyProfile: () => apiClient.get(API_ENDPOINTS.users.me),

  /** Users matching the filters, one page (page 0 = the first). */
  searchUsers: (filters, page, size) =>
    apiClient.get(API_ENDPOINTS.admin.users.list, {
      params: { ...filters, page, size },
    }),

  /** Any user's addresses, the default first. */
  getUserAddresses: (userId) => apiClient.get(API_ENDPOINTS.admin.users.addresses(userId)),

  getUser: (userId) => apiClient.get(API_ENDPOINTS.admin.users.details(userId)),

  /** Activate or deactivate (audited). An inactive user cannot log in or order. */
  changeStatus: (userId, activate, reason) =>
    apiClient.put(
      activate
        ? API_ENDPOINTS.admin.users.activate(userId)
        : API_ENDPOINTS.admin.users.deactivate(userId),
      { reason },
    ),

  /** Audited; the platform always keeps at least one active platform admin. */
  changeRole: (userId, role, reason) =>
    apiClient.put(API_ENDPOINTS.admin.users.role(userId), { role, reason }),

  getAuditLogs: (userId) =>
    apiClient.get(API_ENDPOINTS.admin.users.auditLogs(userId), {
      params: { size: 50 },
    }),
};
