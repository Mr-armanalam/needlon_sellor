import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";
import { usersTable } from "../users";

export const sellerCustomers = pgTable(
  "seller_customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sellerId: uuid("seller_id")
      .notNull()
      .references(() => seller.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    // In-store intake metadata
    customerNotes: text("customer_notes"),
    createdInStore: boolean("created_in_store").notNull().default(true),
    totalInStoreOrders: integer("total_in_store_orders").notNull().default(0),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_seller_customers_unique").on(table.sellerId, table.userId),
  ]
);
