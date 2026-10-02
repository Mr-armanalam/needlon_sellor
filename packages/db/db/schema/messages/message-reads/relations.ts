// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/message-reads/relations.ts
// Description:
// Drizzle relations for Message Reads.
// ============================================================================

import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { messagesTable } from "../messages";

import { messageReadsTable } from "./table";

/**
 * ============================================================================
 * Message Read Relations
 * ============================================================================
 */

export const messageReadsRelations =
    relations(
        messageReadsTable,
        ({ one }) => ({
            /**
             * ----------------------------------------------------------------------
             * Message
             * ----------------------------------------------------------------------
             */

            message: one(messagesTable, {
                fields: [
                    messageReadsTable.messageId,
                ],
                references: [messagesTable.id],
            }),

            /**
             * ----------------------------------------------------------------------
             * Reader
             * ----------------------------------------------------------------------
             */

            seller: one(seller, {
                fields: [
                    messageReadsTable.sellerId,
                ],
                references: [seller.id],
            }),
        }),
    );