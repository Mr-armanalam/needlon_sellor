import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { usersTable } from "../users";
import { referralCodes } from "./referral-code";

// Enums
export const referralEventStatusEnum = pgEnum("referral_event_status", [
  "CLICKED",
  "REGISTERED",
  "VERIFIED",
  "QUALIFIED",
  "REJECTED",
  "REWARDED",
  "PURCHASE_COMPLETED",
  "SUBSCRIPTION_PAID",
  "FIRST_ORDER_COMPLETED",
]);

export const referralOwnerTypeEnum = pgEnum("referral_event_owner_type", [
  "SELLER",
  "BUYER",
  "ADMIN",
  "INFLUENCER",
  "PARTNER",
]);

export const referralUserTypeEnum = pgEnum("referral_event_user_type", [
  "SELLER",
  "BUYER",
]);

export const referralEvents = pgTable("referral_events", {
  id: uuid("id").defaultRandom().primaryKey(),

  referralCodeId: uuid("referral_code_id")
    .notNull()
    .references(() => referralCodes.id, { onDelete: "restrict" }),

  referrerId: uuid("referrer_id").notNull(),
  referrerType: referralOwnerTypeEnum("referrer_type")
    .notNull()
    .default("SELLER"),

  referredUserId: uuid("referred_user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "restrict" }),
  referredUserType: referralUserTypeEnum("referred_user_type")
    .notNull()
    .default("SELLER"),

  campaignName: varchar("campaign_name", { length: 100 }).notNull(),

  status: referralEventStatusEnum("status").notNull().default("CLICKED"),

  qualifiedAt: timestamp("qualified_at", { withTimezone: true }),
  rewardIssued: boolean("reward_issued").notNull().default(false),

  ipHash: varchar("ip_hash", { length: 64 }),
  deviceFingerprintHash: varchar("device_fingerprint_hash", { length: 128 }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
