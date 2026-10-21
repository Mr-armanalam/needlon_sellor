import {
  pgTable,
  text,
  jsonb,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";
import { seller } from "./seller";

/**
 * Platform-wide key/value settings owned by the admin surface
 * (e.g. `commissionRate`). Values are JSON so a setting can be a number,
 * string, boolean or a small object without a schema change per setting.
 * `updatedBy` records the admin seller who last wrote the value.
 */
export const platformSettings = pgTable("platform_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedBy: uuid("updated_by").references(() => seller.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type PlatformSetting = typeof platformSettings.$inferSelect;
export type NewPlatformSetting = typeof platformSettings.$inferInsert;
