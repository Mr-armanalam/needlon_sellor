import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { categories } from "./categories";

// Defining the input type options for the UI wizard generation
export const inputTypeEnum = pgEnum("attribute_input_type", [
  "TEXT",
  "NUMBER",
  "SELECT",
  "MULTI_SELECT",
  "BOOLEAN",
]);

export const categoryAttributes = pgTable(
  "category_attributes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),

    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    inputType: inputTypeEnum("input_type").notNull(),

    isRequired: boolean("is_required").default(false).notNull(),
    isFilterable: boolean("is_filterable").default(true).notNull(),
    isVariantAttribute: boolean("is_variant_attribute")
      .default(false)
      .notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    helperText: text("helper_text"),
    isActive: boolean("is_active").default(true).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Unique slug scoped per category so two categories can safely re-use the same attribute slug
    uniqueIndex("cat_attr_category_slug_idx").on(table.categoryId, table.slug),
  ],
);
