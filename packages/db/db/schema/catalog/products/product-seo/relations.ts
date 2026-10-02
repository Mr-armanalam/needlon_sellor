import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { productsTable } from "@/db/schema/catalog/products/table";

import { productSeoTable } from "./table";

/**
 * ============================================================
 * Product SEO Relations
 * ============================================================
 */

export const productSeoRelations = relations(
    productSeoTable,
    ({ one }) => ({
        /**
         * ----------------------------------------------------------
         * Product
         * ----------------------------------------------------------
         */

        product: one(productsTable, {
            fields: [productSeoTable.productId],
            references: [productsTable.id],
        }),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdBySeller: one(seller, {
            fields: [productSeoTable.createdBy],
            references: [seller.id],
            relationName: "product_seo_created_by",
        }),

        updatedBySeller: one(seller, {
            fields: [productSeoTable.updatedBy],
            references: [seller.id],
            relationName: "product_seo_updated_by",
        }),
    }),
);