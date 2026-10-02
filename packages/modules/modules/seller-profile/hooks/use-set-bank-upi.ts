import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/modules/shared/api";

import {toast} from "sonner";
import {sellerUPI_Api} from "@/modules/seller-profile/api/bank-upi";

export function useSetUPI_ID() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: sellerUPI_Api.set,

        onSuccess: () => {
            toast.success(
                "UPI ID added.",
            );
            queryClient.invalidateQueries({
                queryKey:
                    queryKeys.seller.bank(),
            });
        },
    });
}