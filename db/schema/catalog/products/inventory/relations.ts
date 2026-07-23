import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";

import { inventoryTable } from "./table";

/**
 * ============================================================
 * Inventory Relations
 * ============================================================
 */

export const inventoryRelations = relations(
    inventoryTable,
    ({ one }) => ({
        /**
         * ----------------------------------------------------------
         * Product Variant
         * ----------------------------------------------------------
         */

        variant: one(productVariantsTable, {
            fields: [inventoryTable.variantId],
            references: [productVariantsTable.id],
        }),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdBySeller: one(seller, {
            fields: [inventoryTable.createdBy],
            references: [seller.id],
            relationName: "inventory_created_by",
        }),

        updatedBySeller: one(seller, {
            fields: [inventoryTable.updatedBy],
            references: [seller.id],
            relationName: "inventory_updated_by",
        }),
    }),
);