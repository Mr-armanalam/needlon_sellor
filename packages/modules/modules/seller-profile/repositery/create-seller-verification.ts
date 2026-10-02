import { db } from "@/db";
import { sellerVerification } from "@/db/schema/seller/seller-verification";

type CreateSellerVerification =
    typeof sellerVerification.$inferInsert;

export async function createSellerVerification(
    data: CreateSellerVerification,
) {
    const [verification] =
        await db
            .insert(sellerVerification)
            .values(data)
            .returning();

    return verification;
}