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
import { seller } from "../seller";
import { sellerSubscriptions } from "./seller-subscription";
import { subscriptionPlans } from "./sucbscription-plan";

// Enums
export const paymentGatewayEnum = pgEnum("payment_gateway", [
  "RAZORPAY",
  "CASHFREE",
  "STRIPE",
  "MANUAL",
]);

export const paymentMethodEnum = pgEnum("payment_methode", [
  "UPI",
  "CARD",
  "NET_BANKING",
  "WALLET",
  "BANK_TRANSFER",
  "EMI",
  "PAY_LATER",
]);

export const paymentStatusEnum = pgEnum("payments_status", [
  "PENDING",
  "AUTHORIZED",
  "SUCCESS",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
  "CANCELLED",
]);

export const subscriptionPayments = pgTable("subscription_payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  subscriptionId: uuid("subscription_id")
    .notNull()
    .references(() => sellerSubscriptions.id, { onDelete: "restrict" }),

  sellerId: uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "restrict" }),

  planId: uuid("plan_id")
    .notNull()
    .references(() => subscriptionPlans.id, { onDelete: "restrict" }),

  invoiceNumber: varchar("invoice_number", { length: 100 }),

  paymentGateway: paymentGatewayEnum("payment_gateway").notNull(),
  gatewayOrderId: varchar("gateway_order_id", { length: 255 }),
  gatewayPaymentId: varchar("gateway_payment_id", { length: 255 }),
  gatewayTransactionId: varchar("gateway_transaction_id", { length: 255 }),

  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currencyCode: varchar("currency_code", { length: 3 })
    .notNull()
    .default("INR"),

  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  netAmount: numeric("net_amount", { precision: 10, scale: 2 }).notNull(),

  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  status: paymentStatusEnum("status").notNull().default("PENDING"),

  paidAt: timestamp("paid_at", { withTimezone: true }),
  failureReason: text("failure_reason"),
  gatewayResponse: jsonb("gateway_response"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
