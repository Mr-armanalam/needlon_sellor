import { eq } from "drizzle-orm";

import { db } from "@/db";
import { sellerVerification } from "@/db/schema/seller/seller-verification";

export async function findSellerVerification(
    sellerId: string,
) {
    return db.query.sellerVerification.findFirst({
        where: eq(
            sellerVerification.sellerId,
            sellerId,
        ),
    });
}