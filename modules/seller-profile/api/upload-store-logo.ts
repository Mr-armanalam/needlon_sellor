import { apiClient } from "@/modules/shared/api";

import { SellerStoreDto } from "../dto/seller-store.dto";

export async function uploadStoreLogo(
    file: File,
) {
    const formData = new FormData();

    formData.append(
        "file",
        file,
    );

    return apiClient.post<SellerStoreDto>(
        "/api/seller/store/logo",
        formData,
    );
}