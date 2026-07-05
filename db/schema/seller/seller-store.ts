import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";

// Enums
export const storeStatusEnum = pgEnum("store_status", [
  "DRAFT",
  "PENDING_REVIEW",
  "ACTIVE",
  "SUSPENDED",
  "CLOSED",
  "VACATION_MODE",
  "MAINTENANCE",
  "UNDER_INVESTIGATION",
]);

export const storeVisibilityEnum = pgEnum("store_visibility", [
  "PRIVATE",
  "PUBLIC",
  "UNLISTED",
  "INVITE_ONLY",
  "MEMBERS_ONLY",
]);

export const sellerStore = pgTable("seller_store", {
  sellerId: uuid("seller_id")
    .primaryKey()
    .references(() => seller.id, { onDelete: "cascade" }),

  storeName: varchar("store_name", { length: 150 }).notNull(),
  storeSlug: varchar("store_slug", { length: 150 }).notNull().unique(),

  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),

  shortDescription: varchar("short_description", { length: 255 }),
  description: text("description"),

  supportEmail: varchar("support_email", { length: 255 }),
  supportPhone: varchar("support_phone", { length: 20 }),

  status: storeStatusEnum("status").notNull().default("DRAFT"),
  visibility: storeVisibilityEnum("visibility").notNull().default("PRIVATE"),

  isVerified: boolean("is_verified").notNull().default(false),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  launchedAt: timestamp("launched_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
},
    (table) => [
      index("seller_store_name_idx").on(table.storeName),
      index("seller_store_slug_idx").on(table.storeSlug)
    ]);
