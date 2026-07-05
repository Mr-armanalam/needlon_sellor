import { eq } from "drizzle-orm";

import { db } from "@/db";
import { sellerStore } from "@/db/schema/seller/seller-store";

export async function findStoreBySlug(
    slug: string,
) {
    return db.query.sellerStore.findFirst({
        where: eq(
            sellerStore.storeSlug,
            slug,
        ),
    });
}