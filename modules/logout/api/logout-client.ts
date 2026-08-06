import { apiClient } from "@/modules/shared/api/api-client";

export async function fetchSessionsClient() {
  return apiClient.get<any>("/api/auth/sessions");
}

export async function fetchSecurityAlertsClient() {
  return apiClient.get<any>("/api/auth/security/alerts");
}

export async function fetchAuditLogsClient() {
  return apiClient.get<any>("/api/auth/security/audit-logs");
}

export async function fetchSecurityPreferencesClient() {
  return apiClient.get<any>("/api/auth/security/preferences");
}

export async function updateSecurityPreferencesClient(inactivityTimeout: string) {
  return apiClient.put<any>("/api/auth/security/preferences", { inactivityTimeout });
}

export async function logoutSessionClient(sessionId: string) {
  return apiClient.delete<any>(`/api/auth/sessions/${sessionId}`);
}

export async function logoutOthersClient() {
  return apiClient.post<any>("/api/auth/sessions/logout-others", {});
}

export async function logoutAllSessionsClient() {
  return apiClient.post<any>("/api/auth/sessions/logout-all", {});
}

export async function logoutCurrentSessionClient() {
  return apiClient.post<any>("/api/auth/logout", {});
}
