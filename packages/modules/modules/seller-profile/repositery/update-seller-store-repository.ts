import { eq } from "drizzle-orm";

import { db } from "@/db";
import { sellerStore } from "@/db/schema/seller/seller-store";

type UpdateSellerStoreInput = {
    sellerId: string;
    data: Partial<
        typeof sellerStore.$inferInsert
    >;
};

export async function updateSellerStore({
                                            sellerId,
                                            data,
                                        }: UpdateSellerStoreInput) {
    const [updated] =
        await db
            .update(sellerStore)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(
                eq(
                    sellerStore.sellerId,
                    sellerId,
                ),
            )
            .returning();

    return updated;
}