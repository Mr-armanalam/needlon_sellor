import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sellerAddressApi } from "../api";
import { queryKeys } from "@/modules/shared/api";

export function useCreateSellerAddressMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sellerAddressApi.create,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.seller.addresses(),
            });
        },
    });
}