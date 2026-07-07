import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/modules/shared/api";

import { sellerBankApi } from "../api/seller-bank-api";
import {toast} from "sonner";

export function useUpdateBankAccount() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: ({
                         accountId,
                         ...body
                     }: Parameters<
            typeof sellerBankApi.update
        >[1] & {
            accountId: string;
        }) =>
            sellerBankApi.update(
                accountId,
                body,
            ),

        onSuccess: () => {
            toast.success(
                "Bank account updated.",
            );
            queryClient.invalidateQueries({
                queryKey:
                    queryKeys.seller.bank(),
            });
        },
    });
}