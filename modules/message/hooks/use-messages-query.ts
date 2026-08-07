// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/hooks/use-messages-query.ts
// Description:
// React Query hook for retrieving messages belonging to a conversation.
// ============================================================================

import {
    useQuery,
} from "@tanstack/react-query";

import {
    getConversationMessages,
} from "../api";

import {
    messagesKeys,
} from "../keys";

export function useMessagesQuery(
    conversationId: string,
) {
    const query =
        useQuery({
            queryKey:
                messagesKeys.messages(
                    conversationId,
                ),

            queryFn:
                () =>
                    getConversationMessages(
                        conversationId,
                    ),

            enabled:
                Boolean(
                    conversationId,
                ),
        });

    return {
        messages:
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