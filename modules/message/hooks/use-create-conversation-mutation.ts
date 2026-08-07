// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/hooks/use-create-conversation-mutation.ts
// Description:
// React Query mutation hook for creating a conversation.
// ============================================================================

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createConversation,
} from "../api";

import {
    messagesKeys,
} from "../keys";

import {
    CreateConversationDto,
} from "../dto";

export function useCreateConversationMutation() {
    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({
            mutationFn:
                (
                    body: CreateConversationDto,
                ) =>
                    createConversation(
                        body,
                    ),

            onSuccess:
                async () => {
                    await queryClient.invalidateQueries(
                        {
                            queryKey:
                                messagesKeys.conversations(),
                        },
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