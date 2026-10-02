import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";
import { usersTable } from "../users";

// Enums
export const referralOwnerTypeEnum = pgEnum("referral_owner_type", [
  "SELLER",
  "BUYER",
  "ADMIN",
  "INFLUENCER",
  "PARTNER",
]);

export const referralStatusEnum = pgEnum("referral_status", [
  "ACTIVE",
  "PAUSED",
  "EXPIRED",
  "DISABLED",
]);

export const referralCodes = pgTable(
  "referral_codes",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    ownerType: referralOwnerTypeEnum("owner_type").notNull().default("SELLER"),
    ownerId: uuid("owner_id").notNull(), // FK to seller/buyer depending on type

    campaignName: varchar("campaign_name", { length: 100 })
      .notNull()
      .default("DEFAULT"),

    referralCode: varchar("referral_code", { length: 30 }).notNull(),

    description: text("description"),

    maxUsageLimit: integer("max_usage_limit"),
    usageCount: integer("usage_count").notNull().default(0),

    startsAt: timestamp("starts_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),

    status: referralStatusEnum("status").notNull().default("ACTIVE"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("referral_code_unique_idx").on(table.referralCode),
    uniqueIndex("referral_owner_campaign_idx").on(
      table.ownerId,
      table.campaignName,
    ),
    // Useful for analytics
  ],
);
