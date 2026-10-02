import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    uploadStoreBanner,
} from "../api";

import {
    sellerStoreKeys,
} from "../keys";

export function useUploadStoreBanner() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn:
        uploadStoreBanner,

        onSuccess(store) {
            queryClient.setQueryData(
                sellerStoreKeys.store(),
                store,
            );
        },
    });
}