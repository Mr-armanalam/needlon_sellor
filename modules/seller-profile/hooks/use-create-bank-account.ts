import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/modules/shared/api";

import { sellerBankApi } from "../api/seller-bank-api";
import {toast} from "sonner";

export function useCreateBankAccount() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn:
        sellerBankApi.create,

        onSuccess: () => {
            toast.success(
                "Bank account added.",
            );
            queryClient.invalidateQueries({
                queryKey:
                    queryKeys.seller.bank(),
            });
        },
    });
}