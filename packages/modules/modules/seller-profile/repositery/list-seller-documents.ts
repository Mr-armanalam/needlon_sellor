import { and, desc, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import {sellerDocuments} from "@/db/schema/seller/seller-document";

export async function listSellerDocuments(
    sellerId: string,
) {
    return db.query.sellerDocuments.findMany({
        where: and(
            eq(
                sellerDocuments.sellerId,
                sellerId,
            ),
            isNull(
                sellerDocuments.deletedAt,
            ),
        ),
        orderBy: [
            desc(
                sellerDocuments.isPrimary,
            ),
            desc(
                sellerDocuments.createdAt,
            ),
        ],
    });
}