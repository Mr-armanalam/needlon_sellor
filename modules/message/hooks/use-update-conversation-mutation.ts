// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/hooks/use-update-conversation-mutation.ts
// Description:
// React Query mutation hook for updating a conversation.
// ============================================================================

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    updateConversation,
} from "../api";

import {
    messagesKeys,
} from "../keys";

import {
    UpdateConversationDto,
} from "../dto";

export function useUpdateConversationMutation() {
    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({
            mutationFn:
                (
                    payload: {
                        conversationId: string;
                        body: UpdateConversationDto;
                    },
                ) =>
                    updateConversation(
                        payload.conversationId,
                        payload.body,
                    ),

            onSuccess:
                async (
                    conversation,
                    variables,
                ) => {
                    await Promise.all([
                        queryClient.invalidateQueries(
                            {
                                queryKey:
                                    messagesKeys.conversations(),
                            },
                        ),

                        queryClient.invalidateQueries(
                            {
                                queryKey:
                                    messagesKeys.conversation(
                                        variables.conversationId,
                                    ),
                            },
                        ),
                    ]);

                    queryClient.setQueryData(
                        messagesKeys.conversation(
                            variables.conversationId,
                        ),
                        conversation,
                    );
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