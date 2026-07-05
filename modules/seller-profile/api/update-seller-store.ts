import { apiClient } from "@/modules/shared/api";

import {
    SellerStoreDto,
    UpdateSellerStoreDto,
} from "../dto/seller-store.dto";

export async function updateSellerStore(
    input: UpdateSellerStoreDto,
) {
    return apiClient.patch<SellerStoreDto>(
        "/api/seller/store",
        input,
    );
}