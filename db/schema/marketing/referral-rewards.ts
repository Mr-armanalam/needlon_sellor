import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { referralEvents } from "./referral-events";
import { promotions } from "./promotion";

// Enums
export const rewardTypeEnum = pgEnum("reward_type", [
  "FREE_SUBSCRIPTION",
  "COUPON",
  "CASHBACK",
  "WALLET_CREDIT",
  "PROMOTIONAL_CREDIT",
  "BADGE",
  "FREE_DELIVERY",
  "POINTS",
  "GIFT",
]);

export const rewardUnitEnum = pgEnum("reward_unit", [
  "DAYS",
  "INR",
  "COUPON",
  "POINTS",
]);

export const rewardStatusEnum = pgEnum("reward_status", [
  "ISSUED",
  "REDEEMED",
  "EXPIRED",
  "REVOKED",
]);

export const referralRewards = pgTable("referral_rewards", {
  id: uuid("id").defaultRandom().primaryKey(),

  referralEventId: uuid("referral_event_id")
    .notNull()
    .references(() => referralEvents.id, { onDelete: "restrict" }),

  recipientType: varchar("recipient_type", { length: 50 }).notNull().default("SELLER"),
  recipientId: uuid("recipient_id").notNull(),

  rewardType: rewardTypeEnum("reward_type").notNull(),
  rewardValue: numeric("reward_value", { precision: 10, scale: 2 }),
  rewardUnit: rewardUnitEnum("reward_unit").notNull(),

  promotionId: uuid("promotion_id").references(() => promotions.id, { onDelete: "set null" }),

  expiresAt: timestamp("expires_at", { withTimezone: true }),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true }),

  status: rewardStatusEnum("status").notNull().default("ISSUED"),

  notes: text("notes"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
