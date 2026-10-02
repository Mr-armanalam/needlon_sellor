import { isNotNull } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

// Template categorization enum for dashboard tabs/filters
export const quickReplyCategoryEnum = pgEnum("quick_reply_category", [
  "GENERAL",
  "GREETING",
  "PRODUCT",
  "ORDER",
  "DELIVERY",
  "PAYMENT",
  "RETURN",
  "THANK_YOU",
  "DISCOUNT",
  "FOLLOW_UP",
  "SUPPORT",
]);

export const quickReplies = pgTable(
  "quick_replies",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Nullable reference: NULL represents a system-wide platform template
    sellerId: uuid("seller_id"),

    category: quickReplyCategoryEnum("category").default("GENERAL").notNull(),
    title: varchar("title", { length: 100 }).notNull(),
    message: text("message").notNull(),

    languageCode: varchar("language_code", { length: 10 })
      .default("en")
      .notNull(), // Supports "en", "hi", "mr", etc.
    isSystemTemplate: boolean("is_system_template").default(false).notNull(),
    isFavorite: boolean("is_favorite").default(false).notNull(),

    usageCount: integer("usage_count").default(0).notNull(), // Cached indicator for sorting by "frequently used"
    sortOrder: integer("sort_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      // Crucial for instantly pulling out a seller's personalized keyboard layout
      quickReplySellerIdx: index("quick_replies_seller_idx")
        .on(table.sellerId)
        .where(isNotNull(table.sellerId)),
      // Optimization to retrieve all system templates with zero vendor footprint cross-contamination
      quickReplySystemIdx: index("quick_replies_system_idx").on(
        table.isSystemTemplate,
      ),
    };
  },
);
