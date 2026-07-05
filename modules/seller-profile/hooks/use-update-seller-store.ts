import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    updateSellerStore,
} from "../api";

import { sellerStoreKeys } from "../keys";

export function useUpdateSellerStore() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn:
        updateSellerStore,

        onSuccess(store) {
            queryClient.setQueryData(
                sellerStoreKeys.store(),
                store,
            );
        },
    });
}