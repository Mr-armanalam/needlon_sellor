import { db } from "@/db";
import { sellerStore } from "@/db/schema/seller/seller-store";

export async function createSellerStore(
    sellerId: string,
) {
    const [store] =
        await db
            .insert(sellerStore)
            .values({
                sellerId,

                storeName: "",

                storeSlug: "",
            })
            .returning();

    return store;
}