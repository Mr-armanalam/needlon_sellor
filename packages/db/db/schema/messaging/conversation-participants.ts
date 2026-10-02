import {
  pgTable,
  uuid,
  integer,
  boolean,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { conversations } from "./conversation";

// Defining Actor Architecture Enums
export const participantTypeEnum = pgEnum("conversation_participant_type", [
  "BUYER",
  "SELLER",
  "ADMIN",
  "SUPPORT",
  "DELIVERY_PARTNER",
  "BOT",
]);

export const participantRoleEnum = pgEnum("conversation_participant_role", [
  "MEMBER",
  "OWNER",
  "MODERATOR",
]);

export const conversationParticipants = pgTable(
  "conversation_participants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .references(() => conversations.id, { onDelete: "cascade" })
      .notNull(),

    participantType: participantTypeEnum("participant_type").notNull(),
    participantId: uuid("participant_id").notNull(), // Links to Buyer/Seller/User profiles

    role: participantRoleEnum("role").default("MEMBER").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    // Real-time Messaging Performance Trackers
    lastReadMessageId: uuid("last_read_message_id"),
    lastReadAt: timestamp("last_read_at", { withTimezone: true }),
    unreadCount: integer("unread_count").default(0).notNull(),

    // Independent Inbox Management Configurations
    isMuted: boolean("is_muted").default(false).notNull(),
    isPinned: boolean("is_pinned").default(false).notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),

    // Status Milestones
    leftAt: timestamp("left_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      // Structural Guardrail: Prevents the exact same user profile from joining a chat twice
      convParticipantUniqueIdx: uniqueIndex("conv_participant_unique_idx").on(
        table.conversationId,
        table.participantId,
      ),
      // Performance optimization for querying all chat rooms a user belongs to
      convParticipantLookupIdx: index("conv_participant_lookup_idx").on(
        table.participantId,
      ),
    };
  },
);
