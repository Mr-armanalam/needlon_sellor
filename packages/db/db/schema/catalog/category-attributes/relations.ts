import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { categoriesTable } from "../categories";
import { categoryAttributeOptionsTable } from "../category-attribute-options";

// TODO:
// Add options relation after
// category-attribute-options module
// is implemented.

import { categoryAttributesTable } from "./table";

/**
 * ============================================================
 * Category Attributes Relations
 * ============================================================
 */

export const categoryAttributesRelations = relations(
    categoryAttributesTable,
    ({ one, many }) => ({
        /**
         * ----------------------------------------------------------
         * Category
         * ----------------------------------------------------------
         */

        category: one(categoriesTable, {
            fields: [categoryAttributesTable.categoryId],
            references: [categoriesTable.id],
        }),

        /**
         * ----------------------------------------------------------
         * Attribute Options
         * ----------------------------------------------------------
         */

        options: many(
            categoryAttributeOptionsTable,
        ),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdBySeller: one(seller, {
            fields: [
                categoryAttributesTable.createdBy,
            ],
            references: [seller.id],
            relationName:
                "category_attribute_created_by",
        }),

        updatedBySeller: one(seller, {
            fields: [
                categoryAttributesTable.updatedBy,
            ],
            references: [seller.id],
            relationName:
                "category_attribute_updated_by",
        }),
    }),
);