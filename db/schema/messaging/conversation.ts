import {
  pgTable,
  uuid,
  boolean,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { product_orders } from "../orders/orders";
import { products } from "../products/products";
import { isNotNull } from "drizzle-orm";

// Defining Conversation Type Enum for structured contextual routing
export const conversationTypeEnum = pgEnum("conversation_type", [
  "GENERAL",
  "PRODUCT",
  "ORDER",
  "SUPPORT",
  "GROUP",
  "ANNOUNCEMENT",
]);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationType: conversationTypeEnum("conversation_type")
      .default("GENERAL")
      .notNull(),

    // Participant Identity References (To be linked to authentication/profile schemas)
    buyerId: uuid("buyer_id"),
    sellerId: uuid("seller_id"),

    // Contextual Dynamic Hooks (Mutually Exclusive based on conversation type)
    orderId: uuid("order_id").references(() => product_orders.id, {
      onDelete: "set null",
    }),
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),

    // Performance optimizations for fast mailbox/inbox loading views
    lastMessageId: uuid("last_message_id"), // Denormalized for rapid summary lookups
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }),

    isArchived: boolean("is_archived").default(false).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      // Crucial for ordering a buyer's inbox view by latest activity
      convBuyerInboxIdx: index("conversations_buyer_inbox_idx").on(
        table.buyerId,
        table.lastMessageAt,
      ),
      // Crucial for ordering a seller's inbox view by latest activity
      convSellerInboxIdx: index("conversations_seller_inbox_idx").on(
        table.sellerId,
        table.lastMessageAt,
      ),
      convContextOrderIdx: index("conversations_order_idx")
        .on(table.orderId)
        .where(isNotNull(table.orderId)),
    };
  },
);
