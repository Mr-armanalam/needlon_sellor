import { db } from "@/db";
import {sellerDocuments} from "@/db/schema/seller/seller-document";

type CreateSellerDocument =
    typeof sellerDocuments.$inferInsert;

export async function createSellerDocument(
    data: CreateSellerDocument,
) {
    const [document] =
        await db
            .insert(sellerDocuments)
            .values(data)
            .returning();

    return document;
}