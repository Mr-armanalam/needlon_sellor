// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/message-reactions/table.ts
// Description:
// Stores emoji reactions for messages.
//
// One seller can have only one reaction per message.
// Changing a reaction updates the existing record.
// ============================================================================

import { sql } from "drizzle-orm";

import {
    check,
    index,
    jsonb,
    pgEnum,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import { messagesTable } from "../messages";

import type { MessageReactionMetadata } from "./metadata";

import {
    MESSAGE_REACTIONS,
    MESSAGE_REACTION_SOURCES,
    MESSAGE_REACTION_SYNC_STATUSES,
    MESSAGE_REACTION_DEVICE_ID_MAX_LENGTH,
    MESSAGE_REACTION_SESSION_ID_MAX_LENGTH,
    MESSAGE_REACTION_IP_ADDRESS_MAX_LENGTH,
    MESSAGE_REACTION_USER_AGENT_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================================
 * Enums
 * ============================================================================
 */

export const messageReactionEnum =
    pgEnum(
        "message_reaction",
        [...MESSAGE_REACTIONS],
    );

export const messageReactionSourceEnum =
    pgEnum(
        "message_reaction_source",
        [...MESSAGE_REACTION_SOURCES],
    );

export const messageReactionSyncStatusEnum =
    pgEnum(
        "message_reaction_sync_status",
        [...MESSAGE_REACTION_SYNC_STATUSES],
    );

/**
 * ============================================================================
 * Message Reactions
 * ============================================================================
 */

export const messageReactionsTable =
    pgTable(
        "message_reactions",
        {
            /**
             * ----------------------------------------------------------------------
             * Identity
             * ----------------------------------------------------------------------
             */

            id: uuid("id")
                .defaultRandom()
                .primaryKey(),

            /**
             * ----------------------------------------------------------------------
             * Relations
             * ----------------------------------------------------------------------
             */

            messageId: uuid("message_id")
                .notNull()
                .references(
                    () => messagesTable.id,
                    {
                        onDelete: "cascade",
                    },
                ),

            sellerId: uuid("seller_id")
                .notNull()
                .references(
                    () => seller.id,
                    {
                        onDelete: "cascade",
                    },
                ),

            /**
             * ----------------------------------------------------------------------
             * Reaction
             * ----------------------------------------------------------------------
             */

            reaction:
                messageReactionEnum(
                    "reaction",
                ).notNull(),

            /**
             * ----------------------------------------------------------------------
             * Device Information
             * ----------------------------------------------------------------------
             */

            source:
                messageReactionSourceEnum(
                    "source",
                )
                    .default("WEB")
                    .notNull(),

            syncStatus:
                messageReactionSyncStatusEnum(
                    "sync_status",
                )
                    .default("PENDING")
                    .notNull(),

            deviceId: varchar(
                "device_id",
                {
                    length:
                    MESSAGE_REACTION_DEVICE_ID_MAX_LENGTH,
                },
            ),

            sessionId: varchar(
                "session_id",
                {
                    length:
                    MESSAGE_REACTION_SESSION_ID_MAX_LENGTH,
                },
            ),

            ipAddress: varchar(
                "ip_address",
                {
                    length:
                    MESSAGE_REACTION_IP_ADDRESS_MAX_LENGTH,
                },
            ),

            userAgent: varchar(
                "user_agent",
                {
                    length:
                    MESSAGE_REACTION_USER_AGENT_MAX_LENGTH,
                },
            ),

            /**
             * ----------------------------------------------------------------------
             * Timeline
             * ----------------------------------------------------------------------
             */

            reactedAt: timestamp(
                "reacted_at",
                {
                    withTimezone: true,
                },
            )
                .defaultNow()
                .notNull(),

            syncedAt: timestamp(
                "synced_at",
                {
                    withTimezone: true,
                },
            ),

            /**
             * ----------------------------------------------------------------------
             * Metadata
             * ----------------------------------------------------------------------
             */

            metadata: jsonb("metadata")
                .$type<MessageReactionMetadata>()
                .default(sql`'{}'::jsonb`)
                .notNull(),

            /**
             * ----------------------------------------------------------------------
             * Audit
             * ----------------------------------------------------------------------
             */

            createdAt: timestamp(
                "created_at",
                {
                    withTimezone: true,
                },
            )
                .defaultNow()
                .notNull(),

            updatedAt: timestamp(
                "updated_at",
                {
                    withTimezone: true,
                },
            )
                .defaultNow()
                .notNull(),
        },

        (table) => ({
            /**
             * ================================================================
             * Uniqueness
             * ================================================================
             *
             * A seller can react only once to a message.
             */

            messageSellerUniqueIdx:
                uniqueIndex(
                    "message_reactions_message_seller_uidx",
                ).on(
                    table.messageId,
                    table.sellerId,
                ),

            /**
             * ================================================================
             * Lookup Indexes
             * ================================================================
             */

            messageIdx: index(
                "message_reactions_message_idx",
            ).on(table.messageId),

            sellerIdx: index(
                "message_reactions_seller_idx",
            ).on(table.sellerId),

            reactionIdx: index(
                "message_reactions_reaction_idx",
            ).on(table.reaction),

            sourceIdx: index(
                "message_reactions_source_idx",
            ).on(table.source),

            syncStatusIdx: index(
                "message_reactions_sync_status_idx",
            ).on(table.syncStatus),

            reactedAtIdx: index(
                "message_reactions_reacted_at_idx",
            ).on(table.reactedAt),

            /**
             * ================================================================
             * Checks
             * ================================================================
             */

            syncedAfterReactionCheck:
                check(
                    "message_reactions_synced_after_reacted_chk",
                    sql`${table.syncedAt} IS NULL OR ${table.syncedAt} >= ${table.reactedAt}`,
                ),
        }),
    );