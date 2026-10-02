import { useQuery } from "@tanstack/react-query";

import { getSellerSettings } from "../api";
import { sellerSettingsKeys } from "../keys";

export function useSellerSettingsQuery() {
  return useQuery({
    queryKey: sellerSettingsKeys.detail(),

    queryFn: getSellerSettings,

    staleTime: 1000 * 60 * 10,

    gcTime: 1000 * 60 * 30,

    retry: 1,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,

    refetchOnMount: false,
  });
}
