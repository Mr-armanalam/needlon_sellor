import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";
import { productsTable } from "@/db/schema/catalog/products/table";

import { productAiTable } from "./table";

/**
 * ============================================================
 * Product AI Relations
 * ============================================================
 */

export const productAiRelations = relations(
    productAiTable,
    ({ one }) => ({
        /**
         * ----------------------------------------------------------
         * Product
         * ----------------------------------------------------------
         */

        product: one(productsTable, {
            fields: [productAiTable.productId],
            references: [productsTable.id],
        }),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdBySeller: one(seller, {
            fields: [productAiTable.createdBy],
            references: [seller.id],
            relationName:
                "product_ai_created_by",
        }),

        updatedBySeller: one(seller, {
            fields: [productAiTable.updatedBy],
            references: [seller.id],
            relationName:
                "product_ai_updated_by",
        }),
    }),
);