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
export const actorTypeEnum = pgEnum("audit_actor_type", [
  "SELLER",
  "BUYER",
  "ADMIN",
  "SYSTEM",
]);

export const actionEnum = pgEnum("audit_action", [
  "CREATE",
  "UPDATE",
  "DELETE",
  "LOGIN",
  "LOGOUT",
  "PASSWORD_CHANGED",
  "EMAIL_CHANGED",
  "PHONE_CHANGED",
  "ORDER_UPDATED",
  "ORDER_CANCELLED",
  "PRODUCT_UPDATED",
  "PRODUCT_DELETED",
  "SHOP_UPDATED",
  "SUBSCRIPTION_UPDATED",
  "ROLE_CHANGED",
  "PERMISSION_CHANGED",
]);

export const entityTypeEnum = pgEnum("audit_entity_type", [
  "SELLER",
  "BUYER",
  "SHOP",
  "PRODUCT",
  "ORDER",
  "ORDER_ITEM",
  "MESSAGE",
  "REVIEW",
  "PROMOTION",
  "SUBSCRIPTION",
  "PAYMENT",
  "DELIVERY",
]);

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),

  actorType: actorTypeEnum("actor_type").notNull(),
  actorId: uuid("actor_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),

  action: actionEnum("action").notNull(),
  entityType: entityTypeEnum("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),

  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),

  changeReason: varchar("change_reason", { length: 255 }),
  sessionId: uuid("session_id"),
  deviceId: uuid("device_id"),
  ipHash: varchar("ip_hash", { length: 64 }),
  userAgent: text("user_agent"),
  requestId: uuid("request_id"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
