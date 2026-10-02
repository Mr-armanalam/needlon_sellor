import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { usersTable } from "../users";

// Enums
export const actorTypeEnum = pgEnum("actor_type", ["SELLER", "BUYER", "ADMIN"]);

export const activityTypeEnum = pgEnum("activity_type", [
  "PRODUCT_CREATED",
  "PRODUCT_UPDATED",
  "PRODUCT_PUBLISHED",
  "PRODUCT_ARCHIVED",
  "ORDER_RECEIVED",
  "ORDER_ACCEPTED",
  "ORDER_COMPLETED",
  "MESSAGE_RECEIVED",
  "REVIEW_RECEIVED",
  "STOCK_UPDATED",
  "PROMOTION_CREATED",
  "COUPON_CREATED",
  "SUBSCRIPTION_STARTED",
  "SUBSCRIPTION_RENEWED",
  "PROFILE_UPDATED",
  "SHOP_UPDATED",
  "LOGIN",
  "LOGOUT",
]);

export const referenceTypeEnum = pgEnum("activity_reference_type", [
  "PRODUCT",
  "ORDER",
  "REVIEW",
  "MESSAGE",
  "PROMOTION",
  "COUPON",
  "SUBSCRIPTION",
]);

export const visibilityEnum = pgEnum("activity_visibility", [
  "PRIVATE",
  "TEAM",
  "ADMIN",
]);

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").defaultRandom().primaryKey(),

  actorType: actorTypeEnum("actor_type").notNull().default("SELLER"),
  actorId: uuid("actor_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "restrict" }),

  activityType: activityTypeEnum("activity_type").notNull(),

  title: varchar("title", { length: 150 }).notNull(),
  description: text("description"),

  referenceType: referenceTypeEnum("reference_type"),
  referenceId: uuid("reference_id"),

  metadata: jsonb("metadata"),

  visibility: visibilityEnum("visibility").notNull().default("PRIVATE"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
