// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/hooks/use-notifications-query.ts
// Description:
// React Query hook for retrieving notifications for the authenticated seller.
// ============================================================================

import {
    useQuery,
} from "@tanstack/react-query";

import {
    getNotifications,
} from "../api";

import {
    messagesKeys,
} from "../keys";

export function useNotificationsQuery() {
    const query =
        useQuery({
            queryKey:
                messagesKeys.notifications(),

            queryFn:
            getNotifications,
        });

    return {
        notifications:
        query.data,

        isLoading:
        query.isLoading,

        isFetching:
        query.isFetching,

        error:
        query.error,

        refetch:
        query.refetch,
    };
}