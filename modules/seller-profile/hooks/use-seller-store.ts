import { useQuery } from "@tanstack/react-query";

import { getSellerStore } from "../api";
import { sellerStoreKeys } from "../keys";

export function useSellerStore() {
    const query = useQuery({
        queryKey:
            sellerStoreKeys.store(),

        queryFn:
        getSellerStore,
    });

    return {
        store: query.data,

        isLoading:
        query.isLoading,

        isFetching:
        query.isFetching,

        error:
        query.error,

        refetch:
        query.refetch,
    };
}