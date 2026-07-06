import { eq } from "drizzle-orm";

import { db } from "@/db";
import { sellerVerification } from "@/db/schema/seller/seller-verification";

type UpdateSellerVerification =
    Partial<
        Omit<
            typeof sellerVerification.$inferInsert,
            "sellerId"
        >
    >;

interface Props {
    sellerId: string;
    data: UpdateSellerVerification;
}

export async function updateSellerVerification({
                                                   sellerId,
                                                   data,
                                               }: Props) {
    const [verification] =
        await db
            .update(sellerVerification)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(
                eq(
                    sellerVerification.sellerId,
                    sellerId,
                ),
            )
            .returning();

    return verification;
}