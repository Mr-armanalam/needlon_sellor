// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/conversation-members/relations.ts
// Description:
// Drizzle relations for Conversation Members.
// ============================================================================

import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { conversationsTable } from "../conversations";

import { conversationMembersTable } from "./table";

/**
 * ============================================================================
 * Conversation Member Relations
 * ============================================================================
 */

export const conversationMembersRelations =
    relations(
        conversationMembersTable,
        ({ one }) => ({
            /**
             * ----------------------------------------------------------------------
             * Conversation
             * ----------------------------------------------------------------------
             */

            conversation: one(
                conversationsTable,
                {
                    fields: [
                        conversationMembersTable.conversationId,
                    ],
                    references: [
                        conversationsTable.id,
                    ],
                },
            ),

            /**
             * ----------------------------------------------------------------------
             * Seller
             * ----------------------------------------------------------------------
             */

            seller: one(seller, {
                fields: [
                    conversationMembersTable.sellerId,
                ],
                references: [seller.id],
            }),
        }),
    );