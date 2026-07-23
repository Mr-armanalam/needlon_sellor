import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";

import { pricingTable } from "./table";

/**
 * ============================================================
 * Pricing Relations
 * ============================================================
 */

export const pricingRelations = relations(
    pricingTable,
    ({ one }) => ({
        /**
         * ----------------------------------------------------------
         * Product Variant
         * ----------------------------------------------------------
         */

        variant: one(productVariantsTable, {
            fields: [pricingTable.variantId],
            references: [productVariantsTable.id],
        }),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdBySeller: one(seller, {
            fields: [pricingTable.createdBy],
            references: [seller.id],
            relationName: "pricing_created_by",
        }),

        updatedBySeller: one(seller, {
            fields: [pricingTable.updatedBy],
            references: [seller.id],
            relationName: "pricing_updated_by",
        }),
    }),
);