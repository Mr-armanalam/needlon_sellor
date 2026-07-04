import { getCurrentSellerOrThrow } from "@/modules/seller/services";

import { ensureSellerProfile } from "./ensure-seller-profile";

export async function getSellerProfile() {
    const seller =
        await getCurrentSellerOrThrow();

    return ensureSellerProfile(
        seller.id,
    );
}