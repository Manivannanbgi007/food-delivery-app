import { apiClient } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/utils/apiEndpoints';

/** admin-service: the platform-wide audit log (read-only). */
export const auditLogService = {
  searchAuditLogs: (filters, page, size) =>
    apiClient.get(API_ENDPOINTS.admin.auditLogs.list, {
      params: { ...filters, page, size },
    }),

  /** Which actions the log has, per service, with counts (the filter lists). */
  getActions: () => apiClient.get(API_ENDPOINTS.admin.auditLogs.actions),

  getAuditRecord: (auditId) => apiClient.get(API_ENDPOINTS.admin.auditLogs.details(auditId)),

  /**
   * Asks every service to send its audit records again (the ones made before the platform-wide log existed).
   * Safe to repeat: copies already in the log are skipped. Audited itself.
   */
  backfill: (reason) => apiClient.post(API_ENDPOINTS.admin.auditLogs.backfill, { reason }),
};
