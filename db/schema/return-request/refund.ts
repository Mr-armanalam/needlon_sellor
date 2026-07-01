import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { returnRequests } from "./return-request";
import { product_orders } from "../orders/orders";
import { usersTable } from "../users";
import { seller } from "../seller";
import { subscriptionPayments } from "../subscription/subscription-payment";

// Enums
export const refundStatusEnum = pgEnum("refund_status", [
  "PENDING",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
  "CANCELLED",
  "PARTIALLY_REFUNDED",
  "RETRYING",
]);

export const refundMethodEnum = pgEnum("refund_method", [
  "ORIGINAL_PAYMENT",
  "BANK_TRANSFER",
  "STORE_CREDIT",
  "MANUAL",
  "UPI",
  "WALLET",
]);

export const paymentGatewayEnum = pgEnum("payment_gateway", [
  "RAZORPAY",
  "CASHFREE",
  "STRIPE",
  "MANUAL",
]);

export const refunds = pgTable("refunds", {
  id: uuid("id").defaultRandom().primaryKey(),

  returnRequestId: uuid("return_request_id")
    .notNull()
    .references(() => returnRequests.id, { onDelete: "restrict" }),

  orderId: uuid("order_id")
    .notNull()
    .references(() => product_orders.id, { onDelete: "restrict" }),

  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "restrict" }),

  sellerId: uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "restrict" }),

  paymentId: uuid("payment_id").references(() => subscriptionPayments.id, {
    onDelete: "set null",
  }),

  refundNumber: varchar("refund_number", { length: 100 }).notNull(),
  gatewayRefundId: varchar("gateway_refund_id", { length: 255 }),

  paymentGateway: paymentGatewayEnum("payment_gateway").notNull(),
  refundMethod: refundMethodEnum("refund_method")
    .notNull()
    .default("ORIGINAL_PAYMENT"),

  refundAmount: numeric("refund_amount", { precision: 10, scale: 2 }).notNull(),
  currencyCode: varchar("currency_code", { length: 3 })
    .notNull()
    .default("INR"),

  status: refundStatusEnum("status").notNull().default("PENDING"),
  failureReason: text("failure_reason"),

  processedAt: timestamp("processed_at", { withTimezone: true }),
  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
