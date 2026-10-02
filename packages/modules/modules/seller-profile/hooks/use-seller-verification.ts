import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/modules/shared/api/api-client";

import { SellerVerificationDto } from "../dto";

export function useSellerVerification() {
    return useQuery({
        queryKey: [
            "seller-verification",
        ],

        queryFn: async () => {
            const response =
                await apiClient.get<SellerVerificationDto>(
                    "/api/seller/verification",
                );

            return response;
        },
    });
}