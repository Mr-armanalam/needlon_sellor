import { useQuery } from "@tanstack/react-query";

import { sellerAddressApi } from "../api";
import {queryKeys} from "@/modules/shared/api";

export function useSellerAddressesQuery() {
    return useQuery({
        queryKey: queryKeys.seller.addresses(),
        queryFn: sellerAddressApi.getAll,
    });
}