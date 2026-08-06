export const logoutKeys = {
  all: ["logout"] as const,
  sessions: () => [...logoutKeys.all, "sessions"] as const,
  alerts: () => [...logoutKeys.all, "alerts"] as const,
  auditLogs: () => [...logoutKeys.all, "audit-logs"] as const,
  preferences: () => [...logoutKeys.all, "preferences"] as const,
};
