import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { payments, paymentStatusEnum } from "./payment";
// 1. Defining Ledger Event Specific Enums
export const paymentEventTypeEnum = pgEnum("payment_event_type", [
  "INITIATED",
  "UPI_DETAILS_SHARED",
  "PAYMENT_SUBMITTED",
  "PAYMENT_VERIFIED",
  "CASH_RECEIVED",
  "SELLER_CONFIRMED",
  "FAILED",
  "CANCELLED",
  "EXPIRED",
  "REFUNDED",
  "CHARGEBACK",
  "PARTIALLY_REFUNDED",
  "PAYOUT_COMPLETED",
]);

export const paymentEventActorEnum = pgEnum("payment_event_actor_type", [
  "BUYER",
  "SELLER",
  "ADMIN",
  "SYSTEM",
  "PAYMENT_GATEWAY",
]);

// 2. Payment Events Table Configuration
export const paymentEvents = pgTable(
  "payment_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    paymentId: uuid("payment_id")
      .references(() => payments.id, { onDelete: "cascade" })
      .notNull(),

    eventType: paymentEventTypeEnum("event_type").notNull(),

    // State Machine Tracking
    previousStatus: paymentStatusEnum("previous_status"), // Nullable for initial event
    currentStatus: paymentStatusEnum("current_status").notNull(),

    // Actor Audit Parameters
    performedByType: paymentEventActorEnum("performed_by_type").notNull(),
    performedById: uuid("performed_by_id"), // Nullable to easily support 'SYSTEM' or 'PAYMENT_GATEWAY' webhooks

    // Raw Data Storage and Diagnostics
    gatewayPayload: jsonb("gateway_payload"), // Preserves raw Razorpay/UPI request body payloads
    remarks: text("remarks"),

    // Immutable Event Entry Time
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      paymentTimelineIdx: index("payment_events_timeline_idx").on(
        table.paymentId,
        table.createdAt,
      ),
    };
  },
);
