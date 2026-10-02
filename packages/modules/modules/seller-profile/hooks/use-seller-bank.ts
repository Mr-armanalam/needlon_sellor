import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/modules/shared/api";

import { sellerBankApi } from "../api/seller-bank-api";

export function useSellerBank() {
    return useQuery({
        queryKey:
            queryKeys.seller.bank(),

        queryFn:
        sellerBankApi.get,
    });
}