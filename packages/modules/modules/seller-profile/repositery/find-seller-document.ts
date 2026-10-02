import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import {sellerDocuments} from "@/db/schema/seller/seller-document";

export async function findSellerDocument(
    sellerId: string,
    documentId: string,
) {
    return db.query.sellerDocuments.findFirst({
        where: and(
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
    });
}