import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { notifications } from "./notification-events";

// Enums
export const deliveryChannelEnum = pgEnum("delivery_channel", [
  "IN_APP",
  "PUSH",
  "EMAIL",
  "SMS",
  "WHATSAPP",
  "VOICE_CALL",
]);

export const deliveryStatusEnum = pgEnum("delivery_status", [
  "PENDING",
  "SENT",
  "DELIVERED",
  "OPENED",
  "CLICKED",
  "FAILED",
  "CANCELLED",
]);

export const notificationDeliveries = pgTable("notification_deliveries", {
  id: uuid("id").defaultRandom().primaryKey(),

  notificationId: uuid("notification_id")
    .notNull()
    .references(() => notifications.id, { onDelete: "cascade" }),

  channel: deliveryChannelEnum("channel").notNull(),
  provider: varchar("provider", { length: 100 }),
  providerMessageId: varchar("provider_message_id", { length: 255 }),

  status: deliveryStatusEnum("status").notNull().default("PENDING"),
  attemptCount: integer("attempt_count").notNull().default(1),

  sentAt: timestamp("sent_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  openedAt: timestamp("opened_at", { withTimezone: true }),
  clickedAt: timestamp("clicked_at", { withTimezone: true }),

  failureReason: text("failure_reason"),
  lastRetryAt: timestamp("last_retry_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
