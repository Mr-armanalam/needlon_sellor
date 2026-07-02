import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateSellerSettings } from "../api";
import { sellerSettingsKeys } from "../keys";

export function useUpdateSellerSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSellerSettings,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sellerSettingsKeys.detail(),
      });
    },
  });
}
