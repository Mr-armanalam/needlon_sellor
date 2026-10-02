// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/message-attachments/relations.ts
// Description:
// Drizzle relations for Message Attachments.
// ============================================================================

import { relations } from "drizzle-orm";

import { messagesTable } from "../messages";

import { messageAttachmentsTable } from "./table";

/**
 * ============================================================================
 * Message Attachment Relations
 * ============================================================================
 */

export const messageAttachmentsRelations =
    relations(
        messageAttachmentsTable,
        ({ one }) => ({
            /**
             * ----------------------------------------------------------------------
             * Message
             * ----------------------------------------------------------------------
             */

            message: one(messagesTable, {
                fields: [
                    messageAttachmentsTable.messageId,
                ],
                references: [messagesTable.id],
            }),
        }),
    );