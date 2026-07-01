import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { product_orders } from "./orders";
import { productVariants } from "../products/product_variants";

export const orderedItems = pgTable(
  "ordered_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Relational Integrity Mapping
    orderId: uuid("order_id")
      .references(() => product_orders.id, { onDelete: "cascade" })
      .notNull(),
    productId: uuid("product_id")
      .references(() => product_orders.id, { onDelete: "restrict" })
      .notNull(),
    variantId: uuid("variant_id")
      .references(() => productVariants.id, { onDelete: "restrict" })
      .notNull(),

    // Immutable Data Snapshots
    productName: varchar("product_name", { length: 200 }).notNull(),
    variantSummary: varchar("variant_summary", { length: 255 }).notNull(), // e.g., "Blue / M"
    sku: varchar("sku", { length: 100 }),

    // Financial Breakdowns
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    discountAmount: numeric("discount_amount", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    quantity: integer("quantity").notNull(),
    lineTotal: numeric("line_total", { precision: 12, scale: 2 }).notNull(), // (unitPrice - discountAmount) * quantity

    // Audit Ledger (Deliberately missing an updated_at column to ensure immutability)
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("order_items_parent_idx").on(table.orderId),
    index("order_items_variant_idx").on(table.variantId),
  ],
);
