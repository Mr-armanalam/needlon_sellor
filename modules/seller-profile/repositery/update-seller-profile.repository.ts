import { eq } from "drizzle-orm";

import { DbTransaction } from "@/db/transactions";
import { getDatabase } from "@/db/database";

import { sellerProfiles } from "@/db/schema/seller/seller-profile";

import { UpdateSellerProfileDto } from "../dto/seller-profile.dto";
import { toSellerProfileDto } from "../mapper/seller-profile-mapper";

interface UpdateSellerProfileParams {
    sellerId: string;
    data: UpdateSellerProfileDto;
    tx?: DbTransaction;
}

export async function updateSellerProfile({
                                              sellerId,
                                              data,
                                              tx,
                                          }: UpdateSellerProfileParams) {
    const database = getDatabase(tx);

    const [profile] = await database
        .update(sellerProfiles)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(
            eq(
                sellerProfiles.sellerId,
                sellerId,
            ),
        )
        .returning();

    return profile
        ? toSellerProfileDto(profile)
        : null;
}