import { useQuery } from "@tanstack/react-query";

import { getSellerProfile } from "../api";
import { sellerProfileKeys } from "../keys";

export function useSellerProfile() {
    const query = useQuery({
        queryKey:
            sellerProfileKeys.profile(),

        queryFn:
        getSellerProfile,
    });

    return {
        profile: query.data,

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