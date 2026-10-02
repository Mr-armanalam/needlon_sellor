// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/hooks/use-send-message-mutation.ts
// Description:
// React Query mutation hook for sending a message to a conversation.
// ============================================================================

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    sendMessage,
} from "../api";

import {
    messagesKeys,
} from "../keys";

import {
    SendMessageDto,
} from "../dto";

export function useSendMessageMutation() {
    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({
            mutationFn:
                (
                    body: SendMessageDto,
                ) =>
                    sendMessage(
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
                                        variables.conversationId,
                                    ),
                            },
                        ),

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