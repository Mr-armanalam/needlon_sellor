import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { productsTable } from "@/db/schema/catalog/products/table";

import { productVariantsTable } from "./table";
import {productVariantOptionsTable} from "@/db/schema/catalog/products/product-variant-options/table";
import {inventoryTable} from "@/db/schema/catalog/products/inventory/table";
import {pricingTable} from "@/db/schema/catalog/products/pricing/table";
import {shippingTable} from "@/db/schema/catalog/products/shipping/table";

/**
 * ============================================================
 * Product Variants Relations
 * ============================================================
 */

export const productVariantsRelations =
    relations(
        productVariantsTable,
        ({ one, many }) => ({
            /**
             * ----------------------------------------------------------
             * Product
             * ----------------------------------------------------------
             */

            /**
             * Child Relations
             */

            options: many(productVariantOptionsTable),

            product: one(productsTable, {
                fields: [
                    productVariantsTable.productId,
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
                    productVariantsTable.createdBy,
                ],
                references: [seller.id],
                relationName:
                    "product_variant_created_by",
            }),

            inventory: one(inventoryTable),
            pricing: one(pricingTable),
            shipping: one(shippingTable),

            updatedBySeller: one(seller, {
                fields: [
                    productVariantsTable.updatedBy,
                ],
                references: [seller.id],
                relationName:
                    "product_variant_updated_by",
            }),

            /**
             * ----------------------------------------------------------
             * Future Relations
             * ----------------------------------------------------------
             *
             * Step 2.2.6
             * Variant Attribute Values
             *
             * Step 2.2.7
             * Pricing
             *
             * Step 2.2.8
             * Inventory
             *
             * Step 2.2.9
             * Variant Images
             */
        }),
    );