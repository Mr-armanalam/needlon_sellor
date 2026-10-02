import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";

// Enums
export const themeEnum = pgEnum("theme", [
  "LIGHT",
  "DARK",
  "SYSTEM",
  "HIGH_CONTRAST",
]);

export const sellerSettings = pgTable("seller_settings", {
  sellerId: uuid("seller_id")
    .primaryKey()
    .references(() => seller.id, { onDelete: "cascade" }),

  languageCode: varchar("language_code", { length: 10 })
    .notNull()
    .default("en"),
  currencyCode: varchar("currency_code", { length: 3 })
    .notNull()
    .default("INR"),
  timezone: varchar("timezone", { length: 100 })
    .notNull()
    .default("Asia/Kolkata"),

  emailNotifications: boolean("email_notifications").notNull().default(true),
  smsNotifications: boolean("sms_notifications").notNull().default(true),
  pushNotifications: boolean("push_notifications").notNull().default(true),

  marketingNotifications: boolean("marketing_notifications")
    .notNull()
    .default(false),
  orderNotifications: boolean("order_notifications").notNull().default(true),
  payoutNotifications: boolean("payout_notifications").notNull().default(true),
  lowInventoryNotifications: boolean("low_inventory_notifications")
    .notNull()
    .default(true),

  theme: themeEnum("theme").notNull().default("SYSTEM"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
