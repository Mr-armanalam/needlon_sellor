import { SellerProfileDto } from "../dto/seller-profile.dto";
import {apiClient} from "@/modules/shared/api";

export async function getSellerProfile() {
    return apiClient.get<SellerProfileDto>(
        "api/seller/profile",
    );
}
