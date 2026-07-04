

import { SellerProfileDto } from "../dto/seller-profile.dto";
import { UpdateSellerProfileDto } from "../dto/seller-profile.dto";
import {apiClient} from "@/modules/shared/api";

export async function updateSellerProfile(
    input: UpdateSellerProfileDto,
) {
    return apiClient.patch<
        SellerProfileDto,
        UpdateSellerProfileDto
    >("api/seller/profile", input);
}