import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { productsTable } from "@/db/schema/catalog/products/table";

import { productVideosTable } from "./table";

/**
 * ============================================================
 * product-videos Relations
 * ============================================================
 */

export const productVideosRelations =
    relations(
        productVideosTable,
        ({ one }) => ({
            /**
             * ----------------------------------------------------------
             * Product
             * ----------------------------------------------------------
             */

            product: one(productsTable, {
                fields: [
                    productVideosTable.productId,
                ],
                references: [productsTable.id],
            }),

            /**
             * ----------------------------------------------------------
             * Audit
             * ----------------------------------------------------------
             */

            createdBySeller: one(seller, {
                fields: [
                    productVideosTable.createdBy,
                ],
                references: [seller.id],
                relationName:
                    "product_video_created_by",
            }),

            updatedBySeller: one(seller, {
                fields: [
                    productVideosTable.updatedBy,
                ],
                references: [seller.id],
                relationName:
                    "product_video_updated_by",
            }),
        }),
    );