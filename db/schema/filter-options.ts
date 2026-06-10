import { pgTable, text, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { filterGroups } from "./filter-group";
import { productFilterOptions } from "./product-filter-options";

export const filterOptions = pgTable("filter_options", {
  id: uuid("id").primaryKey().defaultRandom(),

  filterGroupId: uuid("filter_group_id")
    .notNull()
    .references(() => filterGroups.id, { onDelete: "cascade" }),

  value: text("value").notNull(), // Cotton
  slug: text("slug").notNull(), // cotton
  sortOrder: integer("sort_order").default(0),

  createdAt: timestamp("created_at").defaultNow(),
});

export const filterOptionRelations = relations(filterOptions, ({ many }) => ({
  products: many(productFilterOptions),
}));
