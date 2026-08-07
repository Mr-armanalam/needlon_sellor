// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/hooks/use-mark-notification-read-mutation.ts
// Description:
// React Query mutation hook for marking a notification as read.
// ============================================================================

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    markNotificationAsRead,
} from "../api";

import {
    messagesKeys,
} from "../keys";

export function useMarkNotificationReadMutation() {
    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({
            mutationFn:
                (
                    notificationId: string,
                ) =>
                    markNotificationAsRead(
                        notificationId,
                    ),

            onSuccess:
                async () => {
                    await queryClient.invalidateQueries(
                        {
                            queryKey:
                                messagesKeys.notifications(),
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