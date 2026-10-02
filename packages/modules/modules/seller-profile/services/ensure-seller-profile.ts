import { db } from "@/db";
import {createSellerProfile, findSellerProfile} from "@/modules/seller-profile/repositery";


export async function ensureSellerProfile(
    sellerId: string,
) {
    const existing =
        await findSellerProfile({
            sellerId,
        });

    if (existing) {
        return existing;
    }

    return db.transaction(async (tx) => {
        return createSellerProfile({
            sellerId,
            tx,
            data: {
                sellerId,

                displayName: "",

                phoneNumber: null,
                phoneVerified: false,

                profileImageUrl: null,

                businessName: null,
                businessType: null,

                supportEmail: null,
                supportPhone: null,

                websiteUrl: null,

                bio: null,

                dateOfBirth: null,
            },
        });
    });
}