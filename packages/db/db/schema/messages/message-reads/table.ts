// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/message-reads/table.ts
// Description:
// Stores delivery and read receipts for every message participant.
//
// One record exists per (message, participant).
// This enables WhatsApp-like Delivered / Read indicators.
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

import type { MessageReadMetadata } from "./metadata";

import {
    MESSAGE_READ_DEVICE_ID_MAX_LENGTH,
    MESSAGE_READ_IP_ADDRESS_MAX_LENGTH,
    MESSAGE_READ_SESSION_ID_MAX_LENGTH,
    MESSAGE_READ_SOURCES,
    MESSAGE_READ_STATUSES,
    MESSAGE_READ_SYNC_STATUSES,
    MESSAGE_READ_USER_AGENT_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================================
 * Enums
 * ============================================================================
 */

export const messageReadStatusEnum =
    pgEnum(
        "message_read_status",
        [...MESSAGE_READ_STATUSES],
    );

export const messageReadSourceEnum =
    pgEnum(
        "message_read_source",
        [...MESSAGE_READ_SOURCES],
    );

export const messageReadSyncStatusEnum =
    pgEnum(
        "message_read_sync_status",
        [...MESSAGE_READ_SYNC_STATUSES],
    );

/**
 * ============================================================================
 * Message Reads
 * ============================================================================
 */

export const messageReadsTable =
    pgTable(
        "message_reads",
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
                .references(() => seller.id, {
                    onDelete: "cascade",
                }),

            /**
             * ----------------------------------------------------------------------
             * Read Status
             * ----------------------------------------------------------------------
             */

            status: messageReadStatusEnum(
                "status",
            )
                .default("DELIVERED")
                .notNull(),

            source: messageReadSourceEnum(
                "source",
            )
                .default("WEB")
                .notNull(),

            syncStatus:
                messageReadSyncStatusEnum(
                    "sync_status",
                )
                    .default("PENDING")
                    .notNull(),

            /**
             * ----------------------------------------------------------------------
             * Device Information
             * ----------------------------------------------------------------------
             */

            deviceId: varchar(
                "device_id",
                {
                    length:
                    MESSAGE_READ_DEVICE_ID_MAX_LENGTH,
                },
            ),

            sessionId: varchar(
                "session_id",
                {
                    length:
                    MESSAGE_READ_SESSION_ID_MAX_LENGTH,
                },
            ),

            ipAddress: varchar(
                "ip_address",
                {
                    length:
                    MESSAGE_READ_IP_ADDRESS_MAX_LENGTH,
                },
            ),

            userAgent: varchar(
                "user_agent",
                {
                    length:
                    MESSAGE_READ_USER_AGENT_MAX_LENGTH,
                },
            ),

            /**
             * ----------------------------------------------------------------------
             * Timeline
             * ----------------------------------------------------------------------
             */

            deliveredAt: timestamp(
                "delivered_at",
                {
                    withTimezone: true,
                },
            )
                .defaultNow()
                .notNull(),

            readAt: timestamp(
                "read_at",
                {
                    withTimezone: true,
                },
            ),

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
                .$type<MessageReadMetadata>()
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
             */

            messageReaderUniqueIdx:
                uniqueIndex(
                    "message_reads_message_seller_uidx",
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
                "message_reads_message_idx",
            ).on(table.messageId),

            sellerIdx: index(
                "message_reads_seller_idx",
            ).on(table.sellerId),

            statusIdx: index(
                "message_reads_status_idx",
            ).on(table.status),

            sourceIdx: index(
                "message_reads_source_idx",
            ).on(table.source),

            syncStatusIdx: index(
                "message_reads_sync_status_idx",
            ).on(table.syncStatus),

            deliveredAtIdx: index(
                "message_reads_delivered_at_idx",
            ).on(table.deliveredAt),

            readAtIdx: index(
                "message_reads_read_at_idx",
            ).on(table.readAt),

            /**
             * ================================================================
             * Checks
             * ================================================================
             */

            readAfterDeliveredCheck: check(
                "message_reads_read_after_delivered_chk",
                sql`${table.readAt} IS NULL OR ${table.readAt} >= ${table.deliveredAt}`,
            ),
        }),
    );