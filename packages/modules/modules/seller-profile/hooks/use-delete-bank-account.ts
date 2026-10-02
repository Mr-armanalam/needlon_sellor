import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/modules/shared/api";

import { sellerBankApi } from "../api/seller-bank-api";
import {toast} from "sonner";

export function useDeleteBankAccount() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn:
        sellerBankApi.delete,

        onSuccess: () => {
            toast.success(
                "Bank account deleted.",
            );
            queryClient.invalidateQueries({
                queryKey:
                    queryKeys.seller.bank(),
            });
        },
    });
}