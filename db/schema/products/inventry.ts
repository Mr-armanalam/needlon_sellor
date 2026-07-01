import {
  pgTable,
  uuid,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { productVariants } from "./product_variants"; // Relies on the previously created product_variants table

export const inventory = pgTable(
  "inventory",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    variantId: uuid("variant_id")
      .references(() => productVariants.id, { onDelete: "cascade" })
      .notNull(),

    // Quantities
    quantity: integer("quantity").default(0).notNull(),
    reservedQuantity: integer("reserved_quantity").default(0).notNull(),
    lowStockThreshold: integer("low_stock_threshold").default(5).notNull(),

    // Configurations
    allowBackorder: boolean("allow_backorder").default(false).notNull(),

    // Audits & Adjustments
    lastAdjustedAt: timestamp("last_adjusted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("inventory_variant_uniq_idx").on(table.variantId)],
);
