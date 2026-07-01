import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { reviews } from "./reviews"; // Reference to your reviews table

// Reply Status Enum for operational moderation tracks
export const reviewReplyStatusEnum = pgEnum("review_reply_status", [
  "PUBLISHED",
  "HIDDEN",
  "UNDER_REVIEW",
  "REMOVED",
]);

export const reviewReplies = pgTable(
  "review_replies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reviewId: uuid("review_id")
      .references(() => reviews.id, { onDelete: "cascade" })
      .notNull(),

    // Identity validation (Links back to your seller profile/auth layer)
    sellerId: uuid("seller_id").notNull(),

    replyText: text("reply_text").notNull(),
    status: reviewReplyStatusEnum("status").default("PUBLISHED").notNull(),

    // Audit trails for updates
    isEdited: boolean("is_edited").default(false).notNull(),
    editedAt: timestamp("edited_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      // Structural Rule: A review can only contain a single authoritative seller response
      replyReviewUniqIdx: uniqueIndex("reply_review_uniq_idx").on(
        table.reviewId,
      ),

      // Performance optimization for loading a seller's profile response history dashboard
      replySellerIdx: index("review_replies_seller_idx").on(table.sellerId),
    };
  },
);
