import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { categoryAttributes } from "./categories_attribute";

export const categoryAttributeOptions = pgTable(
  "category_attribute_options",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Foreign Key mapping back to the dynamic field definition
    attributeId: uuid("attribute_id")
      .references(() => categoryAttributes.id, { onDelete: "cascade" })
      .notNull(),

    label: varchar("label", { length: 100 }).notNull(), // e.g., "Crimson Red"
    value: varchar("value", { length: 100 }).notNull(), // e.g., "crimson_red"
    displayOrder: integer("display_order").default(0).notNull(),

    // Custom design configurations
    colorHex: varchar("color_hex", { length: 7 }), // For visual color pickers (e.g., "#FF0000")
    metadata: jsonb("metadata"), // Extensible unstructured storage for future UI requirements

    isActive: boolean("is_active").default(true).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Ensuring internal values are unique under a specific attribute's scope
    uniqueIndex("cat_attr_options_val_idx").on(table.attributeId, table.value),
  ],
);
