// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/notifications/table.ts
// Description:
// Stores in-app notifications generated from the messaging module.
// ============================================================================

import { sql } from "drizzle-orm";

import {
    bigint,
    boolean,
    check,
    index,
    jsonb,
    pgEnum,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import { conversationsTable } from "../conversations";
import { messagesTable } from "../messages";

import type { NotificationMetadata } from "./metadata";

import {
    MESSAGE_NOTIFICATION_ACTION_URL_MAX_LENGTH,
    MESSAGE_NOTIFICATION_BODY_MAX_LENGTH,
    MESSAGE_NOTIFICATION_DELIVERY_STATUSES,
    MESSAGE_NOTIFICATION_ICON_MAX_LENGTH,
    MESSAGE_NOTIFICATION_IMAGE_URL_MAX_LENGTH,
    MESSAGE_NOTIFICATION_PRIORITIES,
    MESSAGE_NOTIFICATION_SOURCES,
    MESSAGE_NOTIFICATION_STATUSES,
    MESSAGE_NOTIFICATION_TITLE_MAX_LENGTH,
    MESSAGE_NOTIFICATION_TYPES,
} from "./constants";

/**
 * ============================================================================
 * Enums
 * ============================================================================
 */

export const messageNotificationTypeEnum =
    pgEnum(
        "message_notification_type",
        [...MESSAGE_NOTIFICATION_TYPES],
    );

export const messageNotificationStatusEnum =
    pgEnum(
        "message_notification_status",
        [...MESSAGE_NOTIFICATION_STATUSES],
    );

export const messageNotificationPriorityEnum =
    pgEnum(
        "message_notification_priority",
        [...MESSAGE_NOTIFICATION_PRIORITIES],
    );

export const messageNotificationSourceEnum =
    pgEnum(
        "message_notification_source",
        [...MESSAGE_NOTIFICATION_SOURCES],
    );

export const messageNotificationDeliveryStatusEnum =
    pgEnum(
        "message_notification_delivery_status",
        [...MESSAGE_NOTIFICATION_DELIVERY_STATUSES],
    );

/**
 * ============================================================================
 * Notifications
 * ============================================================================
 */

export const notificationsTable =
    pgTable(
        "message_notifications",
        {
            /**
             * ----------------------------------------------------------
             * Identity
             * ----------------------------------------------------------
             */

            id: uuid("id")
                .defaultRandom()
                .primaryKey(),

            /**
             * ----------------------------------------------------------
             * Recipient
             * ----------------------------------------------------------
             */

            recipientSellerId: uuid(
                "recipient_seller_id",
            )
                .notNull()
                .references(
                    () => seller.id,
                    {
                        onDelete: "cascade",
                    },
                ),

            /**
             * ----------------------------------------------------------
             * Sender
             * ----------------------------------------------------------
             */

            senderSellerId: uuid(
                "sender_seller_id",
            ).references(
                () => seller.id,
                {
                    onDelete: "set null",
                },
            ),

            /**
             * ----------------------------------------------------------
             * Related Resources
             * ----------------------------------------------------------
             */

            conversationId: uuid(
                "conversation_id",
            ).references(
                () =>
                    conversationsTable.id,
                {
                    onDelete: "cascade",
                },
            ),

            messageId: uuid(
                "message_id",
            ).references(
                () => messagesTable.id,
                {
                    onDelete: "cascade",
                },
            ),

            /**
             * ----------------------------------------------------------
             * Notification
             * ----------------------------------------------------------
             */

            type:
                messageNotificationTypeEnum(
                    "type",
                ).notNull(),

            status:
                messageNotificationStatusEnum(
                    "status",
                )
                    .default("UNREAD")
                    .notNull(),

            priority:
                messageNotificationPriorityEnum(
                    "priority",
                )
                    .default("NORMAL")
                    .notNull(),

            source:
                messageNotificationSourceEnum(
                    "source",
                )
                    .default("SYSTEM")
                    .notNull(),

            deliveryStatus:
                messageNotificationDeliveryStatusEnum(
                    "delivery_status",
                )
                    .default("PENDING")
                    .notNull(),

            /**
             * ----------------------------------------------------------
             * Content
             * ----------------------------------------------------------
             */

            title: varchar(
                "title",
                {
                    length:
                    MESSAGE_NOTIFICATION_TITLE_MAX_LENGTH,
                },
            ).notNull(),

            body: varchar(
                "body",
                {
                    length:
                    MESSAGE_NOTIFICATION_BODY_MAX_LENGTH,
                },
            ).notNull(),

            imageUrl: varchar(
                "image_url",
                {
                    length:
                    MESSAGE_NOTIFICATION_IMAGE_URL_MAX_LENGTH,
                },
            ),

            actionUrl: varchar(
                "action_url",
                {
                    length:
                    MESSAGE_NOTIFICATION_ACTION_URL_MAX_LENGTH,
                },
            ),

            icon: varchar(
                "icon",
                {
                    length:
                    MESSAGE_NOTIFICATION_ICON_MAX_LENGTH,
                },
            ),

            /**
             * ----------------------------------------------------------
             * State
             * ----------------------------------------------------------
             */

            isRead: boolean("is_read")
                .default(false)
                .notNull(),

            readAt: timestamp(
                "read_at",
                {
                    withTimezone: true,
                },
            ),

            deliveredAt: timestamp(
                "delivered_at",
                {
                    withTimezone: true,
                },
            ),

            failedAt: timestamp(
                "failed_at",
                {
                    withTimezone: true,
                },
            ),

            retryCount: bigint(
                "retry_count",
                {
                    mode: "number",
                },
            )
                .default(0)
                .notNull(),

            /**
             * ----------------------------------------------------------
             * Metadata
             * ----------------------------------------------------------
             */

            metadata: jsonb(
                "metadata",
            )
                .$type<NotificationMetadata>()
                .default(
                    sql`'{}'::jsonb`,
                )
                .notNull(),

            /**
             * ----------------------------------------------------------
             * Audit
             * ----------------------------------------------------------
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
             * ==========================================================
             * Lookup Indexes
             * ==========================================================
             */

            recipientIdx: index(
                "message_notifications_recipient_idx",
            ).on(
                table.recipientSellerId,
            ),

            senderIdx: index(
                "message_notifications_sender_idx",
            ).on(
                table.senderSellerId,
            ),

            conversationIdx: index(
                "message_notifications_conversation_idx",
            ).on(
                table.conversationId,
            ),

            messageIdx: index(
                "message_notifications_message_idx",
            ).on(
                table.messageId,
            ),

            typeIdx: index(
                "message_notifications_type_idx",
            ).on(table.type),

            statusIdx: index(
                "message_notifications_status_idx",
            ).on(table.status),

            priorityIdx: index(
                "message_notifications_priority_idx",
            ).on(table.priority),

            deliveryStatusIdx: index(
                "message_notifications_delivery_status_idx",
            ).on(
                table.deliveryStatus,
            ),

            readIdx: index(
                "message_notifications_read_idx",
            ).on(table.isRead),

            createdAtIdx: index(
                "message_notifications_created_at_idx",
            ).on(table.createdAt),

            /**
             * ==========================================================
             * Constraints
             * ==========================================================
             */

            retryCountCheck: check(
                "message_notifications_retry_count_chk",
                sql`${table.retryCount} >= 0`,
            ),
        }),
    );