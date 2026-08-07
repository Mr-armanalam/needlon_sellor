// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/hooks/use-delete-message-mutation.ts
// Description:
// React Query mutation hook for deleting a message.
// ============================================================================

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    deleteMessage,
    getMessage,
} from "../api";

import {
    messagesKeys,
} from "../keys";

export function useDeleteMessageMutation() {
    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({
            mutationFn:
                (
                    messageId: string,
                ) =>
                    deleteMessage(
                        messageId,
                    ),

            onSuccess:
                async (
                    _data,
                    messageId,
                ) => {
                    const message =
                        queryClient.getQueryData<{
                            id: string;
                            conversationId: string;
                        }>(
                            messagesKeys.message(
                                messageId,
                            ),
                        );

                    await Promise.all([
                        queryClient.invalidateQueries(
                            {
                                queryKey:
                                    messagesKeys.conversations(),
                            },
                        ),

                        message?.conversationId
                            ? queryClient.invalidateQueries(
                                {
                                    queryKey:
                                        messagesKeys.messages(
                                            message.conversationId,
                                        ),
                                },
                            )
                            : Promise.resolve(),

                        message?.conversationId
                            ? queryClient.invalidateQueries(
                                {
                                    queryKey:
                                        messagesKeys.conversation(
                                            message.conversationId,
                                        ),
                                },
                            )
                            : Promise.resolve(),
                    ]);

                    queryClient.removeQueries({
                        queryKey:
                            messagesKeys.message(
                                messageId,
                            ),
                    });
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