import {
  pgTable,
  uuid,
  text,
  bigint,
  boolean,
  timestamp,
  pgEnum,
  index,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { conversations } from "./conversation";
import { products } from "../products/products";
import { product_orders } from "../orders/orders";

// 1. Defining Messaging Core Enums
export const messageTypeEnum = pgEnum("message_type", [
  "TEXT",
  "IMAGE",
  "PRODUCT",
  "ORDER",
  "SYSTEM",
  "FILE",
  "VOICE",
  "VIDEO",
  "LOCATION",
  "CONTACT",
  "STICKER",
]);

export const messageSenderTypeEnum = pgEnum("message_sender_type", [
  "BUYER",
  "SELLER",
  "ADMIN",
  "SYSTEM",
  "SUPPORT",
  "BOT",
  "DELIVERY_PARTNER",
]);

// 2. Messages Schema
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .references(() => conversations.id, { onDelete: "cascade" })
      .notNull(),

    senderType: messageSenderTypeEnum("sender_type").notNull(),
    senderId: uuid("sender_id"), // Nullable to natively support SYSTEM actors

    messageType: messageTypeEnum("message_type").default("TEXT").notNull(),
    content: text("content"), // Nullable to easily support attachment-only types

    // Interactive Messaging Fields
    replyToMessageId: uuid("reply_to_message_id").references(
      ():AnyPgColumn => messages.id,
      { onDelete: "set null" },
    ), // Self-reference for quoting threads

    // Contextual Rich Card Shared Entities
    relatedProductId: uuid("related_product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    relatedOrderId: uuid("related_order_id").references(
      () => product_orders.id,
      { onDelete: "set null" },
    ),

    // High-performance chronological sequence sequencing number
    sequenceNumber: bigint("sequence_number", { mode: "number" }).notNull(),

    // Immutability Violations Auditing
    isEdited: boolean("is_edited").default(false).notNull(),
    editedAt: timestamp("edited_at", { withTimezone: true }),

    // System Soft-Deletes Configuration
    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      // Crucial for real-time scrolling window rendering pipelines (Sorted automatically by sequencing layers)
      msgStreamIdx: index("messages_stream_idx").on(
        table.conversationId,
        table.sequenceNumber,
      ),
    };
  },
);
