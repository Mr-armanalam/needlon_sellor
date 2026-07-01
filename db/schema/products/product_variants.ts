import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { products } from "./products"; // Relies on the previously created products master table

// Defining Enum for Variant States
export const variantStatusEnum = pgEnum("variant_status", [
  "DRAFT",
  "ACTIVE",
  "INACTIVE",
]);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),

    // Unique Business Identifiers
    sku: varchar("sku", { length: 100 }).notNull(),
    barcode: varchar("barcode", { length: 100 }),

    // Financial Breakdowns (Safe from decimal precision issues)
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    compareAtPrice: numeric("compare_at_price", { precision: 12, scale: 2 }),
    costPrice: numeric("cost_price", { precision: 12, scale: 2 }),

    // Logistics & Operations
    weightGrams: integer("weight_grams"),
    status: variantStatusEnum("status").default("ACTIVE").notNull(),
    position: integer("position").default(0).notNull(), // Layout arrangement order

    // Audits & Lifecycle
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }), // Soft delete protection
  },
  (table) => [
    uniqueIndex("product_variants_sku_idx").on(table.sku),
    index("product_variants_barcode_idx").on(table.barcode),
    index("product_variants_product_idx").on(table.productId, table.position),
  ],
);
