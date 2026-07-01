import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { productVariants } from "./product_variants";
import { inventory } from "./inventry";
import { isNotNull } from "drizzle-orm";

// 1. Transaction Type Enum (Stability guaranteed for business tracking)
export const txnTypeEnum = pgEnum("inventory_transaction_type", [
  "INITIAL_STOCK",
  "STOCK_ADDED",
  "STOCK_REMOVED",
  "ORDER_RESERVED",
  "ORDER_COMPLETED",
  "ORDER_CANCELLED",
  "ORDER_RETURNED",
  "MANUAL_ADJUSTMENT",
  "DAMAGED",
  "LOST",
  "SYSTEM_CORRECTION",
]);

// 2. Reference Source Entity Enum
export const refTypeEnum = pgEnum("inventory_reference_type", [
  "ORDER",
  "RETURN",
  "ADJUSTMENT",
  "IMPORT",
  "SYSTEM",
]);

export const inventoryTransactions = pgTable(
  "inventory_transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    inventoryId: uuid("inventory_id")
      .references(() => inventory.id, { onDelete: "restrict" })
      .notNull(),
    variantId: uuid("variant_id")
      .references(() => productVariants.id, { onDelete: "restrict" })
      .notNull(),

    transactionType: txnTypeEnum("transaction_type").notNull(),

    // Positives add stock; Negatives subtract stock
    quantityChange: integer("quantity_change").notNull(),
    reservedChange: integer("reserved_change").default(0).notNull(),

    // Polymorphic audit origin mapping
    referenceType: refTypeEnum("reference_type"),
    referenceId: uuid("reference_id"),

    notes: text("notes"),
    performedBy: uuid("performed_by"), // ID matching your admin/seller/system user schema

    // Notice there is no updated_at field because ledger entries are completely immutable
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
(table) => [
  index("inventory_txn_variant_idx").on(table.variantId),
  
  index("inventory_txn_ref_idx")
    .on(table.referenceType, table.referenceId)
    // 2. Pass the column straight into the imported helper function
    .where(isNotNull(table.referenceId)),
]
);
