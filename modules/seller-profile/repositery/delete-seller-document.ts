import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import {sellerDocuments} from "@/db/schema/seller/seller-document";

interface Props {
    sellerId: string;
    documentId: string;
}

export async function deleteSellerDocument({
                                               sellerId,
                                               documentId,
                                           }: Props) {
    const [document] =
        await db
            .update(sellerDocuments)
            .set({
                deletedAt: new Date(),
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