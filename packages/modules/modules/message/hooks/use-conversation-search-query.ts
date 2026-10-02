// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/hooks/use-conversation-search-query.ts
// Description:
// React Query hook for searching the authenticated seller's conversations.
// ============================================================================

import {
    useQuery,
} from "@tanstack/react-query";

import {
    searchConversations,
} from "../api";

import {
    messagesKeys,
} from "../keys";

export function useConversationSearchQuery(
    query: string,
) {
    const normalizedQuery =
        query.trim();

    const queryResult =
        useQuery({
            queryKey:
                messagesKeys.conversationSearch(
                    normalizedQuery,
                ),

            queryFn:
                () =>
                    searchConversations(
                        normalizedQuery,
                    ),

            enabled:
                normalizedQuery.length >
                0,
        });

    return {
        conversations:
        queryResult.data,

        isLoading:
        queryResult.isLoading,

        isFetching:
        queryResult.isFetching,

        error:
        queryResult.error,

        refetch:
        queryResult.refetch,
    };
}