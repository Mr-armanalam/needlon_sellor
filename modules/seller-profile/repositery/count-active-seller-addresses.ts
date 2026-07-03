import { and, count, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import {sellerAddresses} from "@/db/schema/seller/seller-address";

export async function countActiveSellerAddresses(sellerId: string) {
    const [result] = await db
        .select({
            count: count(),
        })
        .from(sellerAddresses)
        .where(
            and(
                eq(sellerAddresses.sellerId, sellerId),
                isNull(sellerAddresses.deletedAt),
            ),
        );

    return result.count;
}