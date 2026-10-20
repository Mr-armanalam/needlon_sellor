import { apiClient } from "@/modules/shared/api/api-client";
import type {
  AuditLogItem,
  FormattedSession,
  SecurityAlertItem,
} from "../dto";

/**
 * Response payloads returned by the `/api/auth/sessions` and
 * `/api/auth/security/*` routes (the `data` field unwrapped by `apiClient`).
 */

export interface SecurityPreferencesResponse {
  inactivityTimeout: string;
}

export interface RevokeSessionResponse {
  success: boolean;
}

export interface LogoutOthersResponse {
  success: boolean;
  revokedCount: number;
}

export async function fetchSessionsClient() {
  return apiClient.get<FormattedSession[]>("/api/auth/sessions");
}

export async function fetchSecurityAlertsClient() {
  return apiClient.get<SecurityAlertItem[]>("/api/auth/security/alerts");
}

export async function fetchAuditLogsClient() {
  return apiClient.get<AuditLogItem[]>("/api/auth/security/audit-logs");
}

export async function fetchSecurityPreferencesClient() {
  return apiClient.get<SecurityPreferencesResponse>(
    "/api/auth/security/preferences",
  );
}

export async function updateSecurityPreferencesClient(
  inactivityTimeout: string,
) {
  return apiClient.put<SecurityPreferencesResponse>(
    "/api/auth/security/preferences",
    { inactivityTimeout },
  );
}

export async function logoutSessionClient(sessionId: string) {
  return apiClient.delete<RevokeSessionResponse>(
    `/api/auth/sessions/${sessionId}`,
  );
}

export async function logoutOthersClient() {
  return apiClient.post<LogoutOthersResponse>(
    "/api/auth/sessions/logout-others",
    {},
  );
}

export async function logoutAllSessionsClient() {
  return apiClient.post<RevokeSessionResponse>(
    "/api/auth/sessions/logout-all",
    {},
  );
}

export async function logoutCurrentSessionClient() {
  // The logout route returns only `{ success: true }` with no data payload.
  return apiClient.post<void>("/api/auth/logout", {});
}
