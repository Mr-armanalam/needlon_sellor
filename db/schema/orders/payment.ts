import {
  pgTable,
  uuid,
  varchar,
  char,
  numeric,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { product_orders } from "./orders"; // Reference to your custom order schema
import { isNotNull } from "drizzle-orm";

// 1. Payment Core Operational Enums
export const paymentTypeEnum = pgEnum("payment_type", [
  "ORDER",
  "SUBSCRIPTION",
  "REFUND",
  "PAYOUT",
  "ADJUSTMENT",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "UPI",
  "CASH",
  "CARD",
  "NET_BANKING",
  "WALLET",
  "BNPL",
  "EMI",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
  "CANCELLED",
  "EXPIRED",
]);

export const paymentActorEnum = pgEnum("payment_actor_type", [
  "BUYER",
  "SELLER",
  "PLATFORM",
]);

// 2. Payments Main Table
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Unique system payment identification string
    paymentReference: varchar("payment_reference", { length: 100 }).notNull(),
    paymentType: paymentTypeEnum("payment_type").notNull(),

    // Dynamic Context Relational Hooks (Mutually Exclusive based on payment type)
    orderId: uuid("order_id").references(() => product_orders.id, {
      onDelete: "restrict",
    }),
    subscriptionId: uuid("subscription_id"), // Kept as unconstrained raw UUID for future layout hookup

    // Actor Accounting Boundaries
    payerType: paymentActorEnum("payer_type").notNull(),
    payerId: uuid("payer_id").notNull(),
    payeeType: paymentActorEnum("payee_type").notNull(),
    payeeId: uuid("payee_id"), // Nullable if system automatically processes platform routing

    // Asset Parameters
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: char("currency", { length: 3 }).default("INR").notNull(),
    status: paymentStatusEnum("status").default("PENDING").notNull(),

    // Gateway External Integrations (e.g., UPI UTR Numbers, Razorpay IDs)
    gatewayReference: varchar("gateway_reference", { length: 255 }),

    // Audits & Chronologies
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      paymentRefUniqIdx: uniqueIndex("payments_ref_uniq_idx").on(
        table.paymentReference,
      ),
      paymentOrderLookupIdx: index("payments_order_lookup_idx")
        .on(table.orderId)
        .where(isNotNull(table.orderId)),
      paymentPayerLookupIdx: index("payments_payer_lookup_idx").on(
        table.payerId,
      ),
      paymentGatewayLookupIdx: index("payments_gateway_ref_idx")
        .on(table.gatewayReference)
        .where(isNotNull(table.gatewayReference)),
    };
  },
);
