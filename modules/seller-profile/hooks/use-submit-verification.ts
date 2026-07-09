import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/modules/shared/api";

import { sellerVerificationApi } from "../api";

export function useSubmitVerification() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn:
        sellerVerificationApi.submit,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:
                    queryKeys.seller.verification.root(),
            });
        },
    });
}