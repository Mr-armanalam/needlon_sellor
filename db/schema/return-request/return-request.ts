import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { product_orders } from "../orders/orders";
import { usersTable } from "../users";
import { seller } from "../seller";
import { pickupRequests } from "../delivery/pickup-lifecycle";

// Enums
export const returnStatusEnum = pgEnum("return_status", [
  "REQUESTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "PICKUP_SCHEDULED",
  "IN_TRANSIT",
  "RECEIVED",
  "INSPECTING",
  "APPROVED_FOR_REFUND",
  "REFUND_COMPLETED",
  "EXCHANGE_IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "PARTIALLY_APPROVED",
  "WAITING_FOR_CUSTOMER",
]);

export const returnReasonEnum = pgEnum("return_reason", [
  "DEFECTIVE",
  "DAMAGED",
  "WRONG_ITEM",
  "SIZE_ISSUE",
  "QUALITY_ISSUE",
  "NOT_AS_DESCRIBED",
  "MISSING_PARTS",
  "CHANGED_MIND",
  "OTHER",
]);

export const returnTypeEnum = pgEnum("return_type", [
  "REFUND",
  "EXCHANGE",
  "REPLACEMENT",
]);

export const returnRequests = pgTable("return_requests", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
    .notNull()
    .references(() => product_orders.id, { onDelete: "restrict" }),

  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "restrict" }),

  sellerId: uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "restrict" }),

  returnNumber: varchar("return_number", { length: 100 }).notNull(),

  status: returnStatusEnum("status").notNull().default("REQUESTED"),
  returnReason: returnReasonEnum("return_reason").notNull(),
  returnType: returnTypeEnum("return_type").notNull().default("REFUND"),

  buyerComment: text("buyer_comment"),
  sellerComment: text("seller_comment"),

  pickupRequired: boolean("pickup_required").notNull().default(true),
  pickupRequestId: uuid("pickup_request_id").references(
    () => pickupRequests.id,
    { onDelete: "set null" },
  ),

  approvedAt: timestamp("approved_at", { withTimezone: true }),
  rejectedAt: timestamp("rejected_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
