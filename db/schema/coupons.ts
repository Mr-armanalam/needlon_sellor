import { pgTable, varchar, integer, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  type: varchar("type", { length: 10 }).notNull(), // "PERCENT" | "FLAT"
  value: integer("value").notNull(),                 // discount value
  maxUses: integer("max_uses").default(1),          // usually 1 for per-user coupons
  usedCount: integer("used_count").default(0),
  userId: uuid("user_id"),                           // optional, null = global coupon
  expiresAt: timestamp("expires_at").notNull(),      // coupon expiry
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});
