import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";

// Enums
export const recipientTypeEnum = pgEnum("recipient_type", [
  "SELLER",
  "BUYER",
  "ADMIN",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "NEW_ORDER",
  "NEW_MESSAGE",
  "NEW_REVIEW",
  "ORDER_STATUS",
  "LOW_STOCK",
  "PROMOTION",
  "REFERRAL",
  "SUBSCRIPTION",
  "PAYMENT",
  "SYSTEM",
  "ANNOUNCEMENT",
  "DELIVERY",
  "RETURN",
  "SECURITY_ALERT",
  "ACCOUNT_VERIFICATION",
]);

export const priorityEnum = pgEnum("notification_priority", [
  "LOW",
  "NORMAL",
  "HIGH",
  "CRITICAL",
]);

export const referenceTypeEnum = pgEnum("reference_type", [
  "ORDER",
  "PRODUCT",
  "MESSAGE",
  "REVIEW",
  "PROMOTION",
  "REFERRAL",
  "SUBSCRIPTION",
  "PAYMENT",
]);

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),

  recipientType: recipientTypeEnum("recipient_type")
    .notNull()
    .default("SELLER"),
  recipientId: uuid("recipient_id").notNull(),

  notificationType: notificationTypeEnum("notification_type").notNull(),

  title: varchar("title", { length: 150 }).notNull(),
  message: text("message").notNull(),

  referenceType: referenceTypeEnum("reference_type"),
  referenceId: uuid("reference_id"),

  priority: priorityEnum("priority").notNull().default("NORMAL"),

  isRead: boolean("is_read").notNull().default(false),
  readAt: timestamp("read_at", { withTimezone: true }),

  isArchived: boolean("is_archived").notNull().default(false),

  expiresAt: timestamp("expires_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
