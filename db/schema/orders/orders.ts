import {
  pgTable,
  uuid,
  varchar,
  text,
  char,
  numeric,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// Stable Order Status Enum matching operational pipelines
export const orderStatusEnum = pgEnum("p_order_status", [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "RETURNED",
]);

export const product_orders = pgTable(
  "product_orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Clean, human-readable order identifier (e.g., NDL-2026-000001)
    orderNumber: varchar("order_number", { length: 30 }).notNull(),

    // Core Entities
    buyerId: uuid("buyer_id").notNull(), // Maps to core user account profile
    sellerId: uuid("seller_id").notNull(), // Restricts order context to exactly one independent seller shop

    status: orderStatusEnum("status").default("PENDING").notNull(),
    currency: char("currency", { length: 3 }).default("INR").notNull(),

    // Financial metrics (Numeric prevents JS float compounding rounding anomalies)
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    discountAmount: numeric("discount_amount", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    deliveryCharge: numeric("delivery_charge", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),

    notes: text("notes"),

    // Lifecycle Milestones
    placedAt: timestamp("placed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),

    // Internal Audits
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("orders_number_uniq_idx").on(table.orderNumber),
    index("orders_buyer_lookup_idx").on(table.buyerId, table.placedAt),
    index("orders_seller_lookup_idx").on(table.sellerId, table.placedAt),
    index("orders_status_lookup_idx").on(table.status),
  ],
);
