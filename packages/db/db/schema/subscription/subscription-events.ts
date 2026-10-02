import { pgTable, uuid, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { sellerSubscriptions } from "./seller-subscription";
import { seller } from "../seller";
import { subscriptionPlans } from "./sucbscription-plan";
import { subscriptionPayments } from "./subscription-payment";
import { subscriptionInvoices } from "./subscription-invoice";

// Enums
export const subscriptionEventTypeEnum = pgEnum("subscription_event_type", [
  "TRIAL_STARTED",
  "TRIAL_ENDED",
  "SUBSCRIPTION_ACTIVATED",
  "SUBSCRIPTION_RENEWED",
  "PLAN_UPGRADED",
  "PLAN_DOWNGRADED",
  "PAYMENT_RECEIVED",
  "PAYMENT_FAILED",
  "GRACE_PERIOD_STARTED",
  "GRACE_PERIOD_ENDED",
  "SUBSCRIPTION_EXPIRED",
  "SUBSCRIPTION_CANCELLED",
  "AUTO_RENEW_ENABLED",
  "AUTO_RENEW_DISABLED",
  "COUPON_APPLIED",
  "REFUND_PROCESSED",
  "MANUAL_EXTENSION",
]);

export const subscriptionStatusEnum = pgEnum("subscription_event_status", [
  "TRIAL",
  "ACTIVE",
  "GRACE_PERIOD",
  "EXPIRED",
  "CANCELLED",
  "PENDING_PAYMENT",
  "SUSPENDED",
]);

export const triggeredByEnum = pgEnum("subscription_event_triggered_by", [
  "SELLER",
  "ADMIN",
  "SYSTEM",
]);

export const subscriptionEvents = pgTable("subscription_events", {
  id: uuid("id").defaultRandom().primaryKey(),

  subscriptionId: uuid("subscription_id")
    .notNull()
    .references(() => sellerSubscriptions.id, { onDelete: "restrict" }),

  sellerId: uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "restrict" }),

  eventType: subscriptionEventTypeEnum("event_type").notNull(),

  previousStatus: subscriptionStatusEnum("previous_status"),
  newStatus: subscriptionStatusEnum("new_status"),

  previousPlanId: uuid("previous_plan_id").references(
    () => subscriptionPlans.id,
    { onDelete: "set null" },
  ),
  newPlanId: uuid("new_plan_id").references(() => subscriptionPlans.id, {
    onDelete: "set null",
  }),

  paymentId: uuid("payment_id").references(() => subscriptionPayments.id, {
    onDelete: "set null",
  }),
  invoiceId: uuid("invoice_id").references(() => subscriptionInvoices.id, {
    onDelete: "set null",
  }),

  triggeredBy: triggeredByEnum("triggered_by").notNull().default("SYSTEM"),

  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
