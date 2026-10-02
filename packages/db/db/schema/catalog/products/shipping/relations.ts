import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";

import { shippingTable } from "./table";

/**
 * ============================================================
 * Shipping Relations
 * ============================================================
 */

export const shippingRelations = relations(
    shippingTable,
    ({ one }) => ({
        /**
         * ----------------------------------------------------------
         * Product Variant
         * ----------------------------------------------------------
         */

        variant: one(productVariantsTable, {
            fields: [shippingTable.variantId],
            references: [productVariantsTable.id],
        }),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdBySeller: one(seller, {
            fields: [shippingTable.createdBy],
            references: [seller.id],
            relationName: "shipping_created_by",
        }),

        updatedBySeller: one(seller, {
            fields: [shippingTable.updatedBy],
            references: [seller.id],
            relationName: "shipping_updated_by",
        }),
    }),
);