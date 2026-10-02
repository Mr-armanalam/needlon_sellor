import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sellerAddressApi } from "../api";
import { queryKeys } from "@/modules/shared/api";

export function useUpdateSellerAddressMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sellerAddressApi.update,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.seller.addresses(),
            });
        },
    });
}