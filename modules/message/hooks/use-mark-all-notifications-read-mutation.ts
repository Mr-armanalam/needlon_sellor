// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/hooks/use-mark-all-notifications-read-mutation.ts
// Description:
// React Query mutation hook for marking all notifications as read.
// ============================================================================

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    markAllNotificationsAsRead,
} from "../api";

import {
    messagesKeys,
} from "../keys";

export function useMarkAllNotificationsReadMutation() {
    const queryClient =
        useQueryClient();

    const mutation =
        useMutation({
            mutationFn:
            markAllNotificationsAsRead,

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