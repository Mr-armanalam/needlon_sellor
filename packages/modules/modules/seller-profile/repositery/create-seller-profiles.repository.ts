import { DbTransaction } from "@/db/transactions";
import { getDatabase } from "@/db/database";

import { sellerProfiles } from "@/db/schema/seller/seller-profile";

import { SellerProfileDto } from "../dto/seller-profile.dto";
import { toSellerProfileDto } from "../mapper/seller-profile-mapper";

interface CreateSellerProfileParams {
    sellerId: string;
    data: SellerProfileDto;
    tx?: DbTransaction;
}

export async function createSellerProfile({
                                              sellerId,
                                              data,
                                              tx,
                                          }: CreateSellerProfileParams) {
    const database = getDatabase(tx);

    const [profile] = await database
        .insert(sellerProfiles)
        .values({
            sellerId,

            displayName: data.displayName,

            phoneNumber: data.phoneNumber,

            phoneVerified: data.phoneVerified,

            profileImageUrl:
            data.profileImageUrl,

            businessName:
            data.businessName,

            businessType:
            data.businessType,

            supportEmail:
            data.supportEmail,

            supportPhone:
            data.supportPhone,

            websiteUrl:
            data.websiteUrl,

            bio: data.bio,

            dateOfBirth:
            data.dateOfBirth,
        })
        .returning();

    return toSellerProfileDto(profile);
}