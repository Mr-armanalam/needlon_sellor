// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/hooks/use-delete-conversation-mutation.ts
// Description:
// React Query mutation hook for deleting a conversation.
// ============================================================================

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    deleteConversation,
} from "../api";

import {
    messagesKeys,
} from "../keys";

export function useDeleteConversationMutation() {
    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({
            mutationFn:
                (
                    conversationId: string,
                ) =>
                    deleteConversation(
                        conversationId,
                    ),

            onSuccess:
                async (
                    _data,
                    conversationId,
                ) => {
                    await Promise.all([
                        queryClient.invalidateQueries(
                            {
                                queryKey:
                                    messagesKeys.conversations(),
                            },
                        ),

                        queryClient.removeQueries(
                            {
                                queryKey:
                                    messagesKeys.conversation(
                                        conversationId,
                                    ),
                            },
                        ),
                    ]);
                },
        });

    return {
        mutate:
        mutation.mutate,

        mutateAsync:
        mutation.mutateAsync,

        data:
        mutation.data,

        isPending:
        mutation.isPending,

        isSuccess:
        mutation.isSuccess,

        isError:
        mutation.isError,

        error:
        mutation.error,

        reset:
        mutation.reset,
    };
}