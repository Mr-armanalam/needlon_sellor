import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { updateSellerProfile } from "../api";
import {sellerProfileKeys} from "@/modules/seller-profile/keys";


export function useUpdateSellerProfile() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn:
        updateSellerProfile,

        onSuccess(updated) {
            queryClient.setQueryData(
                sellerProfileKeys.profile(),
                updated,
            );
        },
    });
}