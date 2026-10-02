import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  date,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";

// Enums
export const businessTypeEnum = pgEnum("business_type", [
  "INDIVIDUAL",
  "PROPRIETORSHIP",
  "PARTNERSHIP",
  "LLP",
  "PRIVATE_LIMITED",
  "PUBLIC_LIMITED",
  "TRUST",
  "NGO",
  "OTHER",
]);

export const sellerProfiles = pgTable("seller_profiles", {
  sellerId: uuid("seller_id")
    .primaryKey()
    .references(() => seller.id, { onDelete: "cascade" }),

  displayName: varchar("display_name", { length: 120 }).notNull(),

  phoneNumber: varchar("phone_number", { length: 20 }),
  phoneVerified: boolean("phone_verified").notNull().default(false),

  profileImageUrl: text("profile_image_url"),

  businessName: varchar("business_name", { length: 200 }),
  businessType: businessTypeEnum("business_type"),

  supportEmail: varchar("support_email", { length: 255 }),
  supportPhone: varchar("support_phone", { length: 20 }),

  websiteUrl: text("website_url"),
  bio: text("bio"),

  dateOfBirth: date("date_of_birth"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
