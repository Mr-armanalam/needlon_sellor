// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/hooks/use-update-message-mutation.ts
// Description:
// React Query mutation hook for updating a message.
// ============================================================================

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    updateMessage,
} from "../api";

import {
    messagesKeys,
} from "../keys";

import {
    UpdateMessageDto,
} from "../dto";

export function useUpdateMessageMutation() {
    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({
            mutationFn:
                (
                    body: UpdateMessageDto,
                ) =>
                    updateMessage(
                        body,
                    ),

            onSuccess:
                async (
                    message,
                    variables,
                ) => {
                    await Promise.all([
                        queryClient.invalidateQueries(
                            {
                                queryKey:
                                    messagesKeys.messages(
                                        message.conversationId,
                                    ),
                            },
                        ),

                        queryClient.invalidateQueries(
                            {
                                queryKey:
                                    messagesKeys.conversation(
                                        message.conversationId,
                                    ),
                            },
                        ),

                        queryClient.invalidateQueries(
                            {
                                queryKey:
                                    messagesKeys.conversations(),
                            },
                        ),
                    ]);

                    queryClient.setQueryData(
                        messagesKeys.message(
                            message.id,
                        ),
                        message,
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