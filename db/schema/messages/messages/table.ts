// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/messages/table.ts
// Description:
// Stores every message exchanged inside a conversation.
//
// One record represents one immutable message.
// Attachments, reactions and read receipts are stored separately.
// ============================================================================

import { sql } from "drizzle-orm";

import {
    boolean,
    check,
    index,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import { conversationsTable } from "../conversations";

import type { MessageMetadata } from "./metadata";

import {
    MESSAGE_EDIT_STATUSES,
    MESSAGE_PRIORITIES,
    MESSAGE_SENDER_TYPES,
    MESSAGE_STATUSES,
    MESSAGE_TEXT_MAX_LENGTH,
    MESSAGE_TYPES,
} from "./constants";

/**
 * ============================================================================
 * Enums
 * ============================================================================
 */

export const messageTypeEnum = pgEnum(
    "message_type",
    [...MESSAGE_TYPES],
);

export const messageStatusEnum = pgEnum(
    "message_status",
    [...MESSAGE_STATUSES],
);

export const messageSenderTypeEnum = pgEnum(
    "message_sender_type",
    [...MESSAGE_SENDER_TYPES],
);

export const messageEditStatusEnum = pgEnum(
    "message_edit_status",
    [...MESSAGE_EDIT_STATUSES],
);

export const messagePriorityEnum = pgEnum(
    "message_priority",
    [...MESSAGE_PRIORITIES],
);

/**
 * ============================================================================
 * Messages
 * ============================================================================
 */

export const messagesTable = pgTable(
    "messages",
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
         * Conversation
         * ------------------------------------------------------------------------
         */

        conversationId: uuid("conversation_id")
            .notNull()
            .references(() => conversationsTable.id, {
                onDelete: "cascade",
            }),

        /**
         * ------------------------------------------------------------------------
         * Sender
         * ------------------------------------------------------------------------
         */

        senderId: uuid("sender_id")
            .notNull()
            .references(() => seller.id, {
                onDelete: "cascade",
            }),

        senderType: messageSenderTypeEnum(
            "sender_type",
        )
            .default("SELLER")
            .notNull(),

        /**
         * ------------------------------------------------------------------------
         * Reply
         * ------------------------------------------------------------------------
         */

        replyToMessageId: uuid(
            "reply_to_message_id",
        ),

        /**
         * ------------------------------------------------------------------------
         * Message
         * ------------------------------------------------------------------------
         */

        type: messageTypeEnum("type")
            .default("TEXT")
            .notNull(),

        status: messageStatusEnum("status")
            .default("SENDING")
            .notNull(),

        priority: messagePriorityEnum(
            "priority",
        )
            .default("NORMAL")
            .notNull(),

        text: text("text"),

        /**
         * ------------------------------------------------------------------------
         * Edit
         * ------------------------------------------------------------------------
         */

        editStatus: messageEditStatusEnum(
            "edit_status",
        )
            .default("ORIGINAL")
            .notNull(),

        editedAt: timestamp("edited_at", {
            withTimezone: true,
        }),

        /**
         * ------------------------------------------------------------------------
         * Flags
         * ------------------------------------------------------------------------
         */

        hasAttachments: boolean(
            "has_attachments",
        )
            .default(false)
            .notNull(),

        hasReactions: boolean(
            "has_reactions",
        )
            .default(false)
            .notNull(),

        isSystemMessage: boolean(
            "is_system_message",
        )
            .default(false)
            .notNull(),

        /**
         * ------------------------------------------------------------------------
         * Metadata
         * ------------------------------------------------------------------------
         */

        metadata: jsonb("metadata")
            .$type<MessageMetadata>()
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
         * Lookup Indexes
         * ========================================================================
         */

        conversationIdx: index(
            "messages_conversation_idx",
        ).on(table.conversationId),

        senderIdx: index(
            "messages_sender_idx",
        ).on(table.senderId),

        senderTypeIdx: index(
            "messages_sender_type_idx",
        ).on(table.senderType),

        statusIdx: index(
            "messages_status_idx",
        ).on(table.status),

        typeIdx: index(
            "messages_type_idx",
        ).on(table.type),

        priorityIdx: index(
            "messages_priority_idx",
        ).on(table.priority),

        createdAtIdx: index(
            "messages_created_at_idx",
        ).on(table.createdAt),

        replyToMessageIdx: index(
            "messages_reply_to_message_idx",
        ).on(table.replyToMessageId),

        /**
         * ========================================================================
         * Checks
         * ========================================================================
         */

        textLengthCheck: check(
            "messages_text_length_chk",
            sql.raw(`"text" IS NULL OR length("text") <= 10000`),
        ),
    }),
);