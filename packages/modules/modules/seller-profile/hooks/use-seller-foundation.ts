import { useQuery } from "@tanstack/react-query";


import {
    queryKeys,
} from "@/modules/shared/api/query-keys";
import {sellerFoundationApi} from "@/modules/seller-profile/api/seller-foundation-api";

export function useSellerFoundation() {
    return useQuery({
        queryKey:
            queryKeys.seller.foundation(),

        queryFn: () =>
            sellerFoundationApi.getProgress(),
    });
}