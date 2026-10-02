// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/shared-products/relations.ts
// Description:
// Drizzle relations for Shared Products.
// ============================================================================

import { relations } from "drizzle-orm";

import { productsTable } from "@/db/schema/catalog/products";

import { messagesTable } from "../messages";

import { sharedProductsTable } from "./table";

/**
 * ============================================================================
 * Shared Product Relations
 * ============================================================================
 */

export const sharedProductsRelations =
    relations(
        sharedProductsTable,
        ({ one }) => ({
            /**
             * ----------------------------------------------------------------------
             * Message
             * ----------------------------------------------------------------------
             */

            message: one(messagesTable, {
                fields: [
                    sharedProductsTable.messageId,
                ],

                references: [
                    messagesTable.id,
                ],
            }),

            /**
             * ----------------------------------------------------------------------
             * Product
             * ----------------------------------------------------------------------
             */

            product: one(productsTable, {
                fields: [
                    sharedProductsTable.productId,
                ],

                references: [
                    productsTable.id,
                ],
            }),
        }),
    );