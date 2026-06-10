// product-filter-options.ts
import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { productItems } from "./product-items";
import { filterOptions } from "./filter-options";

export const productFilterOptions = pgTable(
  "product_filter_options",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => productItems.id, { onDelete: "cascade" }),

    filterOptionId: uuid("filter_option_id")
      .notNull()
      .references(() => filterOptions.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({columns: [t.productId, t.filterOptionId]}),
  })
);

export const productFilterOptionsRelations = relations(
  productFilterOptions,
  ({ one }) => ({
    product: one(productItems, {
      fields: [productFilterOptions.productId],
      references: [productItems.id],
    }),
    option: one(filterOptions, {
      fields: [productFilterOptions.filterOptionId],
      references: [filterOptions.id],
    }),
  })
);
