import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    uploadStoreLogo,
} from "../api";

import {
    sellerStoreKeys,
} from "../keys";

export function useUploadStoreLogo() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn:
        uploadStoreLogo,

        onSuccess(store) {
            queryClient.setQueryData(
                sellerStoreKeys.store(),
                store,
            );
        },
    });
}