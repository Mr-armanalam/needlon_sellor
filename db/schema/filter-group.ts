// filter-groups.ts
import { pgTable, text, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { productCategory } from "./product-category";
import { filterOptions } from "./filter-options";

export const filterGroups = pgTable("filter_groups", {
  id: uuid("id").primaryKey().defaultRandom(),

  categoryId: uuid("category_id")
    .notNull()
    .references(() => productCategory.id, { onDelete: "cascade" }),

  name: text("name").notNull(), // Material
  slug: text("slug").notNull(), // material
  sortOrder: integer("sort_order").default(0),

  createdAt: timestamp("created_at").defaultNow(),
});

export const filterGroupRelations = relations(filterGroups, ({ many, one }) => ({
  options: many(filterOptions),
  category: one(productCategory, {
    fields: [filterGroups.categoryId],
    references: [productCategory.id]
  })
}));
