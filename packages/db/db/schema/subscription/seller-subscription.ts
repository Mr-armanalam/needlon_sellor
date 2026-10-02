import {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";
import { subscriptionPlans } from "./sucbscription-plan";

// Enums
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "TRIAL",
  "ACTIVE",
  "GRACE_PERIOD",
  "EXPIRED",
  "CANCELLED",
  "PENDING_PAYMENT",
  "SUSPENDED",
]);

export const billingTypeSnapshotEnum = pgEnum("billing_type_snapshot", [
  "TRIAL",
  "MONTHLY",
  "YEARLY",
  "QUARTERLY",
  "HALF_YEARLY",
]);

export const sellerSubscriptions = pgTable("seller_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),

  sellerId: uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "restrict" }),

  planId: uuid("plan_id")
    .notNull()
    .references(() => subscriptionPlans.id, { onDelete: "restrict" }),

  planNameSnapshot: varchar("plan_name_snapshot", { length: 100 }).notNull(),
  planPriceSnapshot: numeric("plan_price_snapshot", {
    precision: 10,
    scale: 2,
  }).notNull(),
  billingTypeSnapshot: billingTypeSnapshotEnum(
    "billing_type_snapshot",
  ).notNull(),

  status: subscriptionStatusEnum("status").notNull().default("TRIAL"),

  startedAt: timestamp("started_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  currentPeriodStart: timestamp("current_period_start", {
    withTimezone: true,
  }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", {
    withTimezone: true,
  }).notNull(),
  gracePeriodEndsAt: timestamp("grace_period_ends_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  endedAt: timestamp("ended_at", { withTimezone: true }),

  autoRenew: boolean("auto_renew").notNull().default(false),
  isTrialUsed: boolean("is_trial_used").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
