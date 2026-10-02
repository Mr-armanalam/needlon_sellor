import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/modules/shared/api";
import {sellerAddressApi} from "@/modules/seller-profile/api/seller-address-api";

export function useSetDefaultSellerAddressMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sellerAddressApi.setDefault,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.seller.addresses(),
            });
        },
    });
}