// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/notifications/relations.ts
// Description:
// Drizzle relations for Message Notifications.
// ============================================================================

import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { conversationsTable } from "../conversations";
import { messagesTable } from "../messages";

import { notificationsTable } from "./table";

/**
 * ============================================================================
 * Notification Relations
 * ============================================================================
 */

export const notificationsRelations =
    relations(
        notificationsTable,
        ({ one }) => ({
            /**
             * ------------------------------------------------------------------
             * Recipient
             * ------------------------------------------------------------------
             */

            recipient: one(
                seller,
                {
                    fields: [
                        notificationsTable.recipientSellerId,
                    ],

                    references: [
                        seller.id,
                    ],

                    relationName:
                        "notificationRecipient",
                },
            ),

            /**
             * ------------------------------------------------------------------
             * Sender
             * ------------------------------------------------------------------
             */

            sender: one(
                seller,
                {
                    fields: [
                        notificationsTable.senderSellerId,
                    ],

                    references: [
                        seller.id,
                    ],

                    relationName:
                        "notificationSender",
                },
            ),

            /**
             * ------------------------------------------------------------------
             * Conversation
             * ------------------------------------------------------------------
             */

            conversation: one(
                conversationsTable,
                {
                    fields: [
                        notificationsTable.conversationId,
                    ],

                    references: [
                        conversationsTable.id,
                    ],
                },
            ),

            /**
             * ------------------------------------------------------------------
             * Message
             * ------------------------------------------------------------------
             */

            message: one(
                messagesTable,
                {
                    fields: [
                        notificationsTable.messageId,
                    ],

                    references: [
                        messagesTable.id,
                    ],
                },
            ),
        }),
    );