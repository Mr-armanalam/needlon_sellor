import {
  pgTable,
  uuid,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { productVariants } from "./product_variants";
import { categoryAttributes } from "../category/categories_attribute";
import { categoryAttributeOptions } from "../category/categories-attribute-options";

export const variantAttributes = pgTable(
  "variant_attributes",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Link to parent variant target
    variantId: uuid("variant_id")
      .references(() => productVariants.id, { onDelete: "cascade" })
      .notNull(),

    // Link to specific category attribute template (e.g., "Size")
    attributeId: uuid("attribute_id")
      .references(() => categoryAttributes.id, { onDelete: "restrict" })
      .notNull(),

    // Link to chosen selection choice option (e.g., "M")
    optionId: uuid("option_id")
      .references(() => categoryAttributeOptions.id, { onDelete: "restrict" })
      .notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Ensures a variant cannot contain duplicate configurations for a single attribute
    uniqueIndex("variant_attr_uniq_idx").on(table.variantId, table.attributeId),
    // Performance lookup index to query specific values quickly across storefront filters
    index("variant_attr_option_idx").on(table.optionId),
  ],
);
