'use client'
import { useQuery } from "@tanstack/react-query";
import { fetchSecurityAlertsClient, fetchAuditLogsClient } from "../api/logout-client";
import { logoutKeys } from "../keys";

export function useSecurityLogs() {
  const alertsQuery = useQuery({
    queryKey: logoutKeys.alerts(),
    queryFn: fetchSecurityAlertsClient,
  });

  const auditLogsQuery = useQuery({
    queryKey: logoutKeys.auditLogs(),
    queryFn: fetchAuditLogsClient,
  });

  return {
    alerts: alertsQuery.data || [],
    isLoadingAlerts: alertsQuery.isLoading,
    refetchAlerts: alertsQuery.refetch,

    auditLogs: auditLogsQuery.data || [],
    isLoadingAuditLogs: auditLogsQuery.isLoading,
    refetchAuditLogs: auditLogsQuery.refetch,

    isLoading: alertsQuery.isLoading || auditLogsQuery.isLoading,
    refetchAll: () => {
      alertsQuery.refetch();
      auditLogsQuery.refetch();
    },
  };
}
