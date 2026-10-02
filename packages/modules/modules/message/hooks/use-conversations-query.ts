// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/hooks/use-conversations-query.ts
// Description:
// React Query hook for retrieving the authenticated seller's conversations.
// ============================================================================

import {
    useQuery,
} from "@tanstack/react-query";

import {
    getConversations,
} from "../api";

import {
    messagesKeys,
} from "../keys";

export function useConversationsQuery() {
    const query =
        useQuery({
            queryKey:
                messagesKeys.conversations(),

            queryFn:
            getConversations,
        });

    return {
        conversations:
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