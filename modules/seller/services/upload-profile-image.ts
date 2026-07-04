
import { SellerProfileDto } from "@/modules/seller-profile/dto/seller-profile.dto";
import {apiClient} from "@/modules/shared/api";

export async function uploadProfileImage(
    file: File,
) {
    const formData = new FormData();

    formData.append("file", file);

    return apiClient.post<SellerProfileDto>(
        "/api/seller/profile/image",
        formData,
    );
}