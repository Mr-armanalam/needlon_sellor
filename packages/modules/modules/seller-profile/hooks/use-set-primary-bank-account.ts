import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/modules/shared/api";

import { sellerBankApi } from "../api/seller-bank-api";
import {toast} from "sonner";

export function useSetPrimaryBankAccount() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn:
        sellerBankApi.setPrimary,

        onSuccess: () => {
            toast.success(
                "Primary account updated.",
            );
            queryClient.invalidateQueries({
                queryKey:
                    queryKeys.seller.bank(),
            });
        },
    });
}