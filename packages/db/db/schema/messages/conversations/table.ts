// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/conversations/table.ts
// Description:
// Conversation master table.
//
// A conversation represents a chat channel between participants.
// Messages, attachments, reactions and read receipts belong to a conversation.
// ============================================================================

import { sql } from "drizzle-orm";

import {
    boolean,
    check,
    index,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import { ConversationMetadata } from "./metadata";

import {
    CONVERSATION_STATUSES,
    CONVERSATION_TITLE_MAX_LENGTH,
    CONVERSATION_TYPES,
    LAST_MESSAGE_PREVIEW_MAX_LENGTH,
    LAST_MESSAGE_TYPES,
} from "./constants";

/**
 * ============================================================================
 * Enums
 * ============================================================================
 */

export const conversationTypeEnum = pgEnum(
    "conversation_type",
    [...CONVERSATION_TYPES],
);

export const conversationStatusEnum = pgEnum(
    "conversation_status",
    [...CONVERSATION_STATUSES],
);

export const lastMessageTypeEnum = pgEnum(
    "conversation_last_message_type",
    [...LAST_MESSAGE_TYPES],
);

/**
 * ============================================================================
 * Conversation
 * ============================================================================
 */

export const conversationsTable = pgTable(
    "conversations",
    {
        /**
         * ------------------------------------------------------------------------
         * Identity
         * ------------------------------------------------------------------------
         */

        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        /**
         * ------------------------------------------------------------------------
         * Ownership
         * ------------------------------------------------------------------------
         */

        sellerId: uuid("seller_id")
            .notNull()
            .references(() => seller.id, {
                onDelete: "cascade",
            }),

        /**
         * ------------------------------------------------------------------------
         * Conversation
         * ------------------------------------------------------------------------
         */

        type: conversationTypeEnum("type")
            .default("DIRECT")
            .notNull(),

        status: conversationStatusEnum("status")
            .default("ACTIVE")
            .notNull(),

        title: varchar("title", {
            length: CONVERSATION_TITLE_MAX_LENGTH,
        }),

        /**
         * ------------------------------------------------------------------------
         * Last Message
         * ------------------------------------------------------------------------
         */

        lastMessageId: uuid("last_message_id"),

        lastMessageType: lastMessageTypeEnum(
            "last_message_type",
        ),

        lastMessagePreview: varchar(
            "last_message_preview",
            {
                length: LAST_MESSAGE_PREVIEW_MAX_LENGTH,
            },
        ),

        lastMessageAt: timestamp(
            "last_message_at",
            {
                withTimezone: true,
            },
        ),

        /**
         * ------------------------------------------------------------------------
         * Conversation State
         * ------------------------------------------------------------------------
         */

        unreadCount: integer("unread_count")
            .default(0)
            .notNull(),

        participantCount: integer(
            "participant_count",
        )
            .default(0)
            .notNull(),

        isPinned: boolean("is_pinned")
            .default(false)
            .notNull(),

        isMuted: boolean("is_muted")
            .default(false)
            .notNull(),

        isArchived: boolean("is_archived")
            .default(false)
            .notNull(),

        /**
         * ------------------------------------------------------------------------
         * Metadata
         * ------------------------------------------------------------------------
         */

        metadata: jsonb("metadata")
            .$type<ConversationMetadata>()
            .default(sql`'{}'::jsonb`)
            .notNull(),

        /**
         * ------------------------------------------------------------------------
         * Audit
         * ------------------------------------------------------------------------
         */

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        deletedAt: timestamp("deleted_at", {
            withTimezone: true,
        }),
    },

    (table) => ({
        /**
         * ========================================================================
         * Unique Indexes
         * ========================================================================
         */

        sellerLastMessageUniqueIdx: uniqueIndex(
            "conversation_seller_last_message_uidx",
        ).on(
            table.sellerId,
            table.lastMessageId,
        ),

        /**
         * ========================================================================
         * Lookup Indexes
         * ========================================================================
         */

        sellerIdx: index(
            "conversation_seller_idx",
        ).on(table.sellerId),

        typeIdx: index(
            "conversation_type_idx",
        ).on(table.type),

        statusIdx: index(
            "conversation_status_idx",
        ).on(table.status),

        lastMessageAtIdx: index(
            "conversation_last_message_at_idx",
        ).on(table.lastMessageAt),

        createdAtIdx: index(
            "conversation_created_at_idx",
        ).on(table.createdAt),

        /**
         * ========================================================================
         * Checks
         * ========================================================================
         */

        unreadCountCheck: check(
            "conversation_unread_count_chk",
            sql`${table.unreadCount} >= 0`,
        ),

        participantCountCheck: check(
            "conversation_participant_count_chk",
            sql`${table.participantCount} >= 1`,
        ),
    }),
);