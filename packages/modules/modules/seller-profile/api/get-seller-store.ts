import { apiClient } from "@/modules/shared/api";

import { SellerStoreDto } from "../dto/seller-store.dto";

export async function getSellerStore() {
    return apiClient.get<SellerStoreDto>(
        "/api/seller/store",
    );
}