import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { sellerDocuments } from "@/db/schema/seller/seller-document";

import { DocumentType } from "../types";

export async function findSellerDocumentByType(
    sellerId: string,
    documentType: DocumentType,
) {
    return db.query.sellerDocuments.findFirst({
        where: and(
            eq(
                sellerDocuments.sellerId,
                sellerId,
            ),
            eq(
                sellerDocuments.documentType,
                documentType,
            ),
            isNull(
                sellerDocuments.deletedAt,
            ),
        ),
    });
}