// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/messages/relations.ts
// Description:
// Drizzle relations for Messages.
// ============================================================================

import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { conversationsTable } from "../conversations";

import { messagesTable } from "./table";

/**
 * ============================================================================
 * Message Relations
 * ============================================================================
 */

export const messagesRelations = relations(
    messagesTable,
    ({ one, many }) => ({
        /**
         * ------------------------------------------------------------------------
         * Conversation
         * ------------------------------------------------------------------------
         */

        conversation: one(
            conversationsTable,
            {
                fields: [messagesTable.conversationId],
                references: [conversationsTable.id],
            },
        ),

        /**
         * ------------------------------------------------------------------------
         * Sender
         * ------------------------------------------------------------------------
         */

        sender: one(seller, {
            fields: [messagesTable.senderId],
            references: [seller.id],
        }),

        /**
         * ------------------------------------------------------------------------
         * Reply Message
         * ------------------------------------------------------------------------
         */

        replyToMessage: one(messagesTable, {
            fields: [messagesTable.replyToMessageId],
            references: [messagesTable.id],
            relationName: "MessageReplies",
        }),

        /**
         * ------------------------------------------------------------------------
         * Replies
         * ------------------------------------------------------------------------
         */

        replies: many(messagesTable, {
            relationName: "MessageReplies",
        }),
    }),
);