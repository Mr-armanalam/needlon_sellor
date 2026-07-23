import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { productsTable } from "@/db/schema/catalog/products/table";

import { productImagesTable } from "./table";

/**
 * ============================================================
 * Product Images Relations
 * ============================================================
 */

export const productImagesRelations =
    relations(
        productImagesTable,
        ({ one }) => ({
            /**
             * ----------------------------------------------------------
             * Product
             * ----------------------------------------------------------
             */

            product: one(productsTable, {
                fields: [
                    productImagesTable.productId,
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
                    productImagesTable.createdBy,
                ],
                references: [seller.id],
                relationName:
                    "product_image_created_by",
            }),

            updatedBySeller: one(seller, {
                fields: [
                    productImagesTable.updatedBy,
                ],
                references: [seller.id],
                relationName:
                    "product_image_updated_by",
            }),
        }),
    );