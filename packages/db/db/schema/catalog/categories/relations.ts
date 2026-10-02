import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { categoriesTable } from "./table";

/**
 * ============================================================
 * Categories Relations
 * ============================================================
 */

export const categoriesRelations = relations(
    categoriesTable,
    ({ one, many }) => ({
        /**
         * ----------------------------------------------------------
         * Self Hierarchy
         * ----------------------------------------------------------
         */

        parent: one(categoriesTable, {
            fields: [categoriesTable.parentId],
            references: [categoriesTable.id],
            relationName: "category_parent",
        }),

        children: many(categoriesTable, {
            relationName: "category_parent",
        }),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdBySeller: one(seller, {
            fields: [categoriesTable.createdBy],
            references: [seller.id],
            relationName: "category_created_by",
        }),

        updatedBySeller: one(seller, {
            fields: [categoriesTable.updatedBy],
            references: [seller.id],
            relationName: "category_updated_by",
        }),
    }),
);



// TODO: add relation in seller
//
// export const sellerRelations = relations(
//     seller,
//     ({ many }) => ({
//         createdCategories: many(categoriesTable, {
//             relationName: "category_created_by",
//         }),
//
//         updatedCategories: many(categoriesTable, {
//             relationName: "category_updated_by",
//         }),
//     }),
// );