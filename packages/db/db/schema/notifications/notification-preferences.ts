import {
  pgTable,
  uuid,
  varchar,
  boolean,
  time,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { usersTable } from "../users";

// Enums
export const userTypeEnum = pgEnum("user_type", [
  "SELLER",
  "BUYER",
  "ADMIN",
  "SUPPORT",
  "DELIVERY_PARTNER",
]);

export const notificationPreferences = pgTable(
  "notification_preferences",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userType: userTypeEnum("user_type").notNull().default("SELLER"),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    languageCode: varchar("language_code", { length: 10 })
      .notNull()
      .default("en"),
    timezone: varchar("timezone", { length: 100 })
      .notNull()
      .default("Asia/Kolkata"),

    pushEnabled: boolean("push_enabled").notNull().default(true),
    emailEnabled: boolean("email_enabled").notNull().default(true),
    smsEnabled: boolean("sms_enabled").notNull().default(false),

    marketingEnabled: boolean("marketing_enabled").notNull().default(true),
    systemEnabled: boolean("system_enabled").notNull().default(true),
    orderEnabled: boolean("order_enabled").notNull().default(true),
    messageEnabled: boolean("message_enabled").notNull().default(true),
    reviewEnabled: boolean("review_enabled").notNull().default(true),
    promotionEnabled: boolean("promotion_enabled").notNull().default(true),
    subscriptionEnabled: boolean("subscription_enabled")
      .notNull()
      .default(true),

    quietHoursEnabled: boolean("quiet_hours_enabled").notNull().default(false),
    quietHoursStart: time("quiet_hours_start"),
    quietHoursEnd: time("quiet_hours_end"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("notification_preferences_user_idx").on(table.userId),
  ],
);
