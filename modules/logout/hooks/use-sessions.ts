'use client'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSessionsClient,
  fetchSecurityPreferencesClient,
  updateSecurityPreferencesClient,
  logoutSessionClient,
  logoutOthersClient,
  logoutAllSessionsClient,
  logoutCurrentSessionClient,
} from "../api/logout-client";
import { logoutKeys } from "../keys";

export function useSessions() {
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: logoutKeys.sessions(),
    queryFn: fetchSessionsClient,
  });

  const preferencesQuery = useQuery({
    queryKey: logoutKeys.preferences(),
    queryFn: fetchSecurityPreferencesClient,
    retry: false, // In case preferences route is not fully implemented on server
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: updateSecurityPreferencesClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logoutKeys.preferences() });
    },
  });

  const logoutSessionMutation = useMutation({
    mutationFn: logoutSessionClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logoutKeys.sessions() });
    },
  });

  const logoutOthersMutation = useMutation({
    mutationFn: logoutOthersClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logoutKeys.sessions() });
    },
  });

  const logoutAllMutation = useMutation({
    mutationFn: logoutAllSessionsClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logoutKeys.all });
    },
  });

  const logoutCurrentMutation = useMutation({
    mutationFn: logoutCurrentSessionClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logoutKeys.all });
    },
  });

  return {
    sessions: sessionsQuery.data || [],
    isLoadingSessions: sessionsQuery.isLoading,
    refetchSessions: sessionsQuery.refetch,
    
    preferences: preferencesQuery.data || {},
    isLoadingPreferences: preferencesQuery.isLoading,
    refetchPreferences: preferencesQuery.refetch,

    updatePreferences: updatePreferencesMutation.mutateAsync,
    isUpdatingPreferences: updatePreferencesMutation.isPending,

    logoutSession: logoutSessionMutation.mutateAsync,
    isLoggingOutSession: logoutSessionMutation.isPending,

    logoutOthers: logoutOthersMutation.mutateAsync,
    isLoggingOutOthers: logoutOthersMutation.isPending,

    logoutAll: logoutAllMutation.mutateAsync,
    isLoggingOutAll: logoutAllMutation.isPending,

    logoutCurrent: logoutCurrentMutation.mutateAsync,
    isLoggingOutCurrent: logoutCurrentMutation.isPending,
  };
}
