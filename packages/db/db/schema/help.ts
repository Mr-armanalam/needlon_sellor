import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { seller } from "./seller";

export const sellerSupportTickets = pgTable("seller_support_tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  sellerId: uuid("seller_id")
    .references(() => seller.id, { onDelete: "cascade" })
    .notNull(),
  ticketNumber: varchar("ticket_number", { length: 32 }).notNull().unique(),
  subject: varchar("subject", { length: 255 }).notNull(),
  category: varchar("category", { length: 64 }).notNull().default("OTHER"),
  priority: varchar("priority", { length: 32 }).notNull().default("MEDIUM"),
  status: varchar("status", { length: 32 }).notNull().default("OPEN"),
  assignedAgent: varchar("assigned_agent", { length: 128 })
    .notNull()
    .default("Support Desk"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const supportTicketMessages = pgTable("support_ticket_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  ticketId: uuid("ticket_id")
    .references(() => sellerSupportTickets.id, { onDelete: "cascade" })
    .notNull(),
  senderType: varchar("sender_type", { length: 32 }).notNull(), // 'seller' | 'agent' | 'system'
  senderName: varchar("sender_name", { length: 128 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const knowledgeBaseArticles = pgTable("knowledge_base_articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: varchar("category", { length: 64 }).notNull(), // 'selling' | 'delivery' | 'payment'
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  readTime: varchar("read_time", { length: 32 }).notNull().default("4 min read"),
  icon: varchar("icon", { length: 64 }).notNull().default("BookOpen"),
  views: integer("views").notNull().default(0),
  helpfulVotes: integer("helpful_votes").notNull().default(0),
  unhelpfulVotes: integer("unhelpful_votes").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const sellerAcademyProgress = pgTable("seller_academy_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  sellerId: uuid("seller_id")
    .references(() => seller.id, { onDelete: "cascade" })
    .notNull(),
  itemId: varchar("item_id", { length: 128 }).notNull(),
  itemType: varchar("item_type", { length: 32 }).notNull(), // 'article' | 'video' | 'onboarding_task'
  progressPercent: integer("progress_percent").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const sellerCallbackRequests = pgTable("seller_callback_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  sellerId: uuid("seller_id")
    .references(() => seller.id, { onDelete: "cascade" })
    .notNull(),
  phoneNumber: varchar("phone_number", { length: 32 }).notNull(),
  preferredTimeSlot: varchar("preferred_time_slot", { length: 64 }).notNull(),
  reason: text("reason"),
  status: varchar("status", { length: 32 }).notNull().default("PENDING"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
