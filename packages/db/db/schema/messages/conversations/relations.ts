// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/conversations/relations.ts
// Description:
// Drizzle relations for Conversations.
// ============================================================================

import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { conversationsTable } from "./table";

/**
 * ============================================================================
 * Conversation Relations
 * ============================================================================
 */

export const conversationsRelations = relations(
    conversationsTable,
    ({ one }) => ({
        /**
         * ------------------------------------------------------------------------
         * Owner Seller
         * ------------------------------------------------------------------------
         */

        seller: one(seller, {
            fields: [conversationsTable.sellerId],
            references: [seller.id],
        }),
    }),
);