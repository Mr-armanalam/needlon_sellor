import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { categoryAttributesTable } from "@/db/schema/catalog/category-attributes";
import { categoryAttributeOptionsTable } from "@/db/schema/catalog/category-attribute-options";

import { productsTable } from "@/db/schema/catalog/products/table";

import { productAttributeValuesTable } from "./table";

/**
 * ============================================================
 * Product Attribute Values Relations
 * ============================================================
 */

export const productAttributeValuesRelations =
    relations(
        productAttributeValuesTable,
        ({ one }) => ({
            /**
             * ----------------------------------------------------------
             * Product
             * ----------------------------------------------------------
             */

            product: one(productsTable, {
                fields: [
                    productAttributeValuesTable.productId,
                ],
                references: [productsTable.id],
            }),

            /**
             * ----------------------------------------------------------
             * Category Attribute
             * ----------------------------------------------------------
             */

            attribute: one(categoryAttributesTable, {
                fields: [
                    productAttributeValuesTable.attributeId,
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
                        productAttributeValuesTable.attributeOptionId,
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
                    productAttributeValuesTable.createdBy,
                ],
                references: [seller.id],
                relationName:
                    "product_attribute_value_created_by",
            }),

            updatedBySeller: one(seller, {
                fields: [
                    productAttributeValuesTable.updatedBy,
                ],
                references: [seller.id],
                relationName:
                    "product_attribute_value_updated_by",
            }),
        }),
    );