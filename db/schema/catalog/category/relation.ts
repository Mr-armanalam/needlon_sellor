import { relations } from "drizzle-orm";

import { categories } from "./table";

export const categoryRelations = relations(
    categories,
    ({ one, many }) => ({
        parent: one(categories, {
            fields: [categories.parentId],
            references: [categories.id],
            relationName: "category_parent",
        }),

        children: many(categories, {
            relationName: "category_parent",
        }),
    }),
);