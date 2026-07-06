import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import {sellerDocuments} from "@/db/schema/seller/seller-document";

type UpdateSellerDocument =
    Partial<
        Omit<
            typeof sellerDocuments.$inferInsert,
            "sellerId"
        >
    >;

interface Props {
    sellerId: string;
    documentId: string;
    data: UpdateSellerDocument;
}

export async function updateSellerDocument({
                                               sellerId,
                                               documentId,
                                               data,
                                           }: Props) {
    const [document] =
        await db
            .update(sellerDocuments)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(
                        sellerDocuments.id,
                        documentId,
                    ),
                    eq(
                        sellerDocuments.sellerId,
                        sellerId,
                    ),
                    isNull(
                        sellerDocuments.deletedAt,
                    ),
                ),
            )
            .returning();

    return document;
}