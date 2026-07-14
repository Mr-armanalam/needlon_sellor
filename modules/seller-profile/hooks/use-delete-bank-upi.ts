import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/modules/shared/api";

import {toast} from "sonner";
import {sellerUPI_Api} from "@/modules/seller-profile/api/bank-upi";

export function useDeleteBankUpi() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: sellerUPI_Api.delete,
        onSuccess: () => {
            toast.success(
                "UPI ID Unlinked.",
            );
            queryClient.invalidateQueries({
                queryKey:
                    [...(queryKeys.seller.upi()),...(queryKeys.seller.bank())]
            });
        },
    });
}