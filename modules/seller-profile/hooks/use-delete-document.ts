import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { apiClient } from "@/modules/shared/api/api-client";

export function useDeleteDocument() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: async (
            documentId: string,
        ) => {
            await apiClient.delete(
                `/api/seller/verification/documents/${documentId}`,
            );
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    "seller-verification",
                ],
            });
        },
    });
}