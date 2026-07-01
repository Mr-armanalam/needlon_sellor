import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { usersTable } from "../users";

// Enums
export const userTypeEnum = pgEnum("push_user_type", [
  "SELLER",
  "BUYER",
  "ADMIN",
  "SUPPORT",
  "DELIVERY_PARTNER",
]);

export const platformEnum = pgEnum("push_platform", [
  "ANDROID",
  "IOS",
  "WEB",
  "DESKTOP",
]);

export const providerEnum = pgEnum("push_provider", [
  "FCM",
  "APNS",
  "WEB_PUSH",
]);

export const pushTokenStatusEnum = pgEnum("push_token_status", [
  "ACTIVE",
  "INACTIVE",
  "INVALID",
  "REVOKED",
]);

export const pushDeviceTokens = pgTable(
  "push_device_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userType: userTypeEnum("user_type").notNull().default("SELLER"),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    deviceId: uuid("device_id").notNull(),
    platform: platformEnum("platform").notNull(),
    provider: providerEnum("provider").notNull().default("FCM"),

    pushToken: text("push_token").notNull(),

    deviceName: varchar("device_name", { length: 100 }),
    appVersion: varchar("app_version", { length: 30 }),
    osVersion: varchar("os_version", { length: 30 }),

    languageCode: varchar("language_code", { length: 10 })
      .notNull()
      .default("en"),

    lastSeenAt: timestamp("last_seen_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    lastTokenRefreshAt: timestamp("last_token_refresh_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    status: pushTokenStatusEnum("status").notNull().default("ACTIVE"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("push_device_unique_idx").on(table.deviceId, table.pushToken),
    uniqueIndex("push_token_unique_idx").on(table.pushToken),
    uniqueIndex("push_device_user_idx").on(table.userId, table.deviceId),
  ],
);
