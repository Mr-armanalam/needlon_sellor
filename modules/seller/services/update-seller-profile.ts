import { db } from "@/db";

import { getCurrentSellerOrThrow } from "@/modules/seller/services";

import { ensureSellerProfile } from "./ensure-seller-profile";
import {UpdateSellerProfileDto} from "@/modules/seller-profile/dto/seller-profile.dto";
import {findSellerProfile, updateSellerProfile} from "@/modules/seller-profile/repositery";


export async function updateSellerProfileService(
    data: UpdateSellerProfileDto,
) {
    const seller =
        await getCurrentSellerOrThrow();

    await ensureSellerProfile(
        seller.id,
    );

    return db.transaction(async (tx) => {
        const profile =
            await findSellerProfile({
                sellerId: seller.id,
                tx,
            });

        if (!profile) {
            throw new Error(
                "Seller profile not found.",
            );
        }

        return updateSellerProfile({
            tx,
            sellerId: seller.id,
            data,
        });
    });
}