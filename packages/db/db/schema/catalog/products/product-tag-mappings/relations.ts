import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { productsTable } from "@/db/schema/catalog/products/table";
import { productTagsTable } from "@/db/schema/catalog/products/product-tags/table";

import { productTagMappingsTable } from "./table";

/**
 * ============================================================
 * Product Tag Mapping Relations
 * ============================================================
 */

export const productTagMappingsRelations = relations(
    productTagMappingsTable,
    ({ one }) => ({
        /**
         * ----------------------------------------------------------
         * Product
         * ----------------------------------------------------------
         */

        product: one(productsTable, {
            fields: [productTagMappingsTable.productId],
            references: [productsTable.id],
        }),

        /**
         * ----------------------------------------------------------
         * Tag
         * ----------------------------------------------------------
         */

        tag: one(productTagsTable, {
            fields: [productTagMappingsTable.tagId],
            references: [productTagsTable.id],
        }),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdBySeller: one(seller, {
            fields: [productTagMappingsTable.createdBy],
            references: [seller.id],
            relationName:
                "product_tag_mapping_created_by",
        }),
    }),
);