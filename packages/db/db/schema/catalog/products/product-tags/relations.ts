import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { productTagMappingsTable } from "@/db/schema/catalog/products/product-tag-mappings/table";

import { productTagsTable } from "./table";

/**
 * ============================================================
 * Product Tag Relations
 * ============================================================
 */

export const productTagsRelations = relations(
    productTagsTable,
    ({ many, one }) => ({
        /**
         * ----------------------------------------------------------
         * Product Mappings
         * ----------------------------------------------------------
         */

        productMappings: many(
            productTagMappingsTable,
        ),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdBySeller: one(seller, {
            fields: [productTagsTable.createdBy],
            references: [seller.id],
            relationName:
                "product_tag_created_by",
        }),

        updatedBySeller: one(seller, {
            fields: [productTagsTable.updatedBy],
            references: [seller.id],
            relationName:
                "product_tag_updated_by",
        }),
    }),
);