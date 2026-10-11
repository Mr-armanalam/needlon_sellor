import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";
import { usersTable } from "../users";

export const chatPermissions = pgTable(
  "chat_permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sellerId: uuid("seller_id")
      .notNull()
      .references(() => seller.id, { onDelete: "cascade" }),
    buyerId: uuid("buyer_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    // Status: REQUESTED | ACCEPTED | DECLINED | BLOCKED
    status: varchar("status", { length: 30 }).notNull().default("REQUESTED"),

    // Privacy protection toggle: customer can enable or disable anytime
    isEnabled: boolean("is_enabled").notNull().default(true),

    requestMessage: text("request_message"),
    requestedAt: timestamp("requested_at", { withTimezone: true }).defaultNow().notNull(),
    respondedAt: timestamp("responded_at", { withTimezone: true }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_chat_permissions_unique").on(table.sellerId, table.buyerId),
  ]
);
