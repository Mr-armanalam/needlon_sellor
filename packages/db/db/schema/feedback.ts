import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { seller } from "./seller";

export const feedbackRoadmapItems = pgTable("feedback_roadmap_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("Planned"), // 'Planned' | 'In Development' | 'Released'
  upvoteCount: integer("upvote_count").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const feedbackUpvotes = pgTable(
  "feedback_upvotes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    featureId: uuid("feature_id")
      .references(() => feedbackRoadmapItems.id, { onDelete: "cascade" })
      .notNull(),
    sellerId: uuid("seller_id")
      .references(() => seller.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    featureSellerUnique: unique("feature_seller_upvote_unique").on(
      table.featureId,
      table.sellerId
    ),
  })
);

export const feedbackComments = pgTable("feedback_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  featureId: uuid("feature_id")
    .references(() => feedbackRoadmapItems.id, { onDelete: "cascade" })
    .notNull(),
  sellerId: uuid("seller_id")
    .references(() => seller.id, { onDelete: "cascade" })
    .notNull(),
  sellerName: varchar("seller_name", { length: 128 }).notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const sellerFeedbacks = pgTable("seller_feedbacks", {
  id: uuid("id").defaultRandom().primaryKey(),
  sellerId: uuid("seller_id")
    .references(() => seller.id, { onDelete: "cascade" })
    .notNull(),
  feedbackNumber: varchar("feedback_number", { length: 32 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 64 }).notNull().default("Feature Request"),
  priority: varchar("priority", { length: 32 }).notNull().default("Medium"),
  description: text("description").notNull(),
  deviceInfo: varchar("device_info", { length: 128 }),
  browserInfo: varchar("browser_info", { length: 128 }),
  appVersion: varchar("app_version", { length: 64 }),
  status: varchar("status", { length: 32 }).notNull().default("SUBMITTED"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const sellerSurveys = pgTable("seller_surveys", {
  id: uuid("id").defaultRandom().primaryKey(),
  sellerId: uuid("seller_id")
    .references(() => seller.id, { onDelete: "cascade" })
    .notNull(),
  rating: integer("rating").notNull(),
  feedbackText: text("feedback_text"),
  context: varchar("context", { length: 128 }).default("Product Listing Workflow"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
