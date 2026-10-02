import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { categoryAttributesTable } from "@/db/schema/catalog/category-attributes";

import { categoryAttributeOptionsTable } from "@/db/schema/catalog/category-attribute-options";

import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";

import { productVariantOptionsTable } from "./table";

/**
 * ============================================================
 * Product Variant Options Relations
 * ============================================================
 */

export const productVariantOptionsRelations =
    relations(
        productVariantOptionsTable,
        ({ one }) => ({
            /**
             * ----------------------------------------------------------
             * Product Variant
             * ----------------------------------------------------------
             */

            variant: one(productVariantsTable, {
                fields: [
                    productVariantOptionsTable.variantId,
                ],
                references: [productVariantsTable.id],
            }),

            /**
             * ----------------------------------------------------------
             * Category Attribute
             * ----------------------------------------------------------
             */

            attribute: one(categoryAttributesTable, {
                fields: [
                    productVariantOptionsTable.attributeId,
                ],
                references: [
                    categoryAttributesTable.id,
                ],
            }),

            /**
             * ----------------------------------------------------------
             * Category Attribute Option
             * ----------------------------------------------------------
             */

            attributeOption: one(
                categoryAttributeOptionsTable,
                {
                    fields: [
                        productVariantOptionsTable.attributeOptionId,
                    ],
                    references: [
                        categoryAttributeOptionsTable.id,
                    ],
                },
            ),

            /**
             * ----------------------------------------------------------
             * Audit
             * ----------------------------------------------------------
             */

            createdBySeller: one(seller, {
                fields: [
                    productVariantOptionsTable.createdBy,
                ],
                references: [seller.id],
                relationName:
                    "product_variant_option_created_by",
            }),

            updatedBySeller: one(seller, {
                fields: [
                    productVariantOptionsTable.updatedBy,
                ],
                references: [seller.id],
                relationName:
                    "product_variant_option_updated_by",
            }),
        }),
    );