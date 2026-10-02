import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { categoryAttributesTable } from "../category-attributes";

import { categoryAttributeOptionsTable } from "./table";

/**
 * ============================================================
 * Category Attribute Options Relations
 * ============================================================
 */

export const categoryAttributeOptionsRelations =
    relations(
        categoryAttributeOptionsTable,
        ({ one }) => ({
            /**
             * ----------------------------------------------------------
             * Category Attribute
             * ----------------------------------------------------------
             */

            attribute: one(categoryAttributesTable, {
                fields: [
                    categoryAttributeOptionsTable.attributeId,
                ],
                references: [
                    categoryAttributesTable.id,
                ],
            }),

            /**
             * ----------------------------------------------------------
             * Audit
             * ----------------------------------------------------------
             */

            createdBySeller: one(seller, {
                fields: [
                    categoryAttributeOptionsTable.createdBy,
                ],
                references: [seller.id],
                relationName:
                    "category_attribute_option_created_by",
            }),

            updatedBySeller: one(seller, {
                fields: [
                    categoryAttributeOptionsTable.updatedBy,
                ],
                references: [seller.id],
                relationName:
                    "category_attribute_option_updated_by",
            }),
        }),
    );