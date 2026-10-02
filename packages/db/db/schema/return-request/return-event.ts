import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { returnRequests } from "./return-request";
import { seller } from "../seller";
import { usersTable } from "../users";

// Enums
export const returnEventTypeEnum = pgEnum("return_event_type", [
  "RETURN_REQUESTED",
  "UNDER_REVIEW",
  "RETURN_APPROVED",
  "RETURN_REJECTED",
  "PICKUP_REQUESTED",
  "PICKUP_SCHEDULED",
  "PICKED_UP",
  "RETURN_RECEIVED",
  "INSPECTION_STARTED",
  "INSPECTION_COMPLETED",
  "REFUND_APPROVED",
  "REFUND_COMPLETED",
  "EXCHANGE_APPROVED",
  "EXCHANGE_SHIPPED",
  "RETURN_COMPLETED",
  "RETURN_CANCELLED",
  "MANUAL_OVERRIDE",
  "DISPUTE_OPENED",
  "DISPUTE_RESOLVED",
]);

export const returnStatusEnum = pgEnum("return_event_status", [
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

export const performedByEnum = pgEnum("return_event_performed_by", [
  "BUYER",
  "SELLER",
  "ADMIN",
  "SYSTEM",
]);

export const returnEvents = pgTable("return_events", {
  id: uuid("id").defaultRandom().primaryKey(),

  returnRequestId: uuid("return_request_id")
    .notNull()
    .references(() => returnRequests.id, { onDelete: "restrict" }),

  sellerId: uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "restrict" }),

  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "restrict" }),

  eventType: returnEventTypeEnum("event_type").notNull(),

  previousStatus: returnStatusEnum("previous_status"),
  newStatus: returnStatusEnum("new_status"),

  performedBy: performedByEnum("performed_by").notNull().default("SYSTEM"),
  performedById: uuid("performed_by_id"),

  notes: text("notes"),
  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
