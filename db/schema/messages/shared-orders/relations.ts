// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/shared-orders/relations.ts
// Description:
// Drizzle relations for Shared Orders.
// ============================================================================

import { relations } from "drizzle-orm";

import { orders as ordersTable } from "@/db/schema/orders";

import { messagesTable } from "../messages";

import { sharedOrdersTable } from "./table";

/**
 * ============================================================================
 * Shared Order Relations
 * ============================================================================
 */

export const sharedOrdersRelations =
    relations(
        sharedOrdersTable,
        ({ one }) => ({
            /**
             * ----------------------------------------------------------------------
             * Message
             * ----------------------------------------------------------------------
             */

            message: one(messagesTable, {
                fields: [
                    sharedOrdersTable.messageId,
                ],

                references: [
                    messagesTable.id,
                ],
            }),

            /**
             * ----------------------------------------------------------------------
             * Order
             * ----------------------------------------------------------------------
             */

            order: one(ordersTable, {
                fields: [
                    sharedOrdersTable.orderId,
                ],

                references: [
                    ordersTable.id,
                ],
            }),
        }),
    );