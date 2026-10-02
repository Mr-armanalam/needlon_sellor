import { db } from "@/db";
import { sellerStore } from "@/db/schema/seller/seller-store";

export async function createSellerStore(
    sellerId: string,
) {
    const defaultSlug = `store-${sellerId.substring(0, 8)}-${Math.random().toString(36).substring(2, 6)}`;
    const [store] =
        await db
            .insert(sellerStore)
            .values({
                sellerId,

                storeName: "Boutique Store",

                storeSlug: defaultSlug,
            })
            .returning();

    return store;
}