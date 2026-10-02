// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/message-reactions/relations.ts
// Description:
// Drizzle relations for Message Reactions.
// ============================================================================

import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { messagesTable } from "../messages";

import { messageReactionsTable } from "./table";

/**
 * ============================================================================
 * Message Reaction Relations
 * ============================================================================
 */

export const messageReactionsRelations =
    relations(
        messageReactionsTable,
        ({ one }) => ({
            /**
             * ----------------------------------------------------------------------
             * Message
             * ----------------------------------------------------------------------
             */

            message: one(messagesTable, {
                fields: [
                    messageReactionsTable.messageId,
                ],
                references: [messagesTable.id],
            }),

            /**
             * ----------------------------------------------------------------------
             * Seller
             * ----------------------------------------------------------------------
             */

            seller: one(seller, {
                fields: [
                    messageReactionsTable.sellerId,
                ],
                references: [seller.id],
            }),
        }),
    );