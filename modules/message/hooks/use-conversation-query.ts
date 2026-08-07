// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/hooks/use-conversation-query.ts
// Description:
// React Query hook for retrieving a single conversation.
// ============================================================================

import {
    useQuery,
} from "@tanstack/react-query";

import {
    getConversation,
} from "../api";

import {
    messagesKeys,
} from "../keys";

export function useConversationQuery(
    conversationId: string,
) {
    const query =
        useQuery({
            queryKey:
                messagesKeys.conversation(
                    conversationId,
                ),

            queryFn:
                () =>
                    getConversation(
                        conversationId,
                    ),

            enabled:
                Boolean(
                    conversationId,
                ),
        });

    return {
        conversation:
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