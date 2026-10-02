import { eq } from "drizzle-orm";

import { DbTransaction } from "@/db/transactions";
import { getDatabase } from "@/db/database";
import { sellerProfiles } from "@/db/schema/seller/seller-profile";

import { toSellerProfileDto } from "../mapper/seller-profile-mapper";

interface Props {
    sellerId: string;
    tx?: DbTransaction;
}

export async function findSellerProfile({
                                            sellerId,
                                            tx,
                                        }: Props) {
    const database = getDatabase(tx);

    const profile =
        await database.query.sellerProfiles.findFirst({
            where: eq(
                sellerProfiles.sellerId,
                sellerId,
            ),
        });

    if (!profile) {
        return null;
    }

    return toSellerProfileDto(profile);
}