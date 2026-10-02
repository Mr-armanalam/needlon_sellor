// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/conversation-members/table.ts
// Description:
// Stores participants of a conversation.
//
// Every participant (Seller, Buyer, Admin, Support, etc.) has exactly one
// membership record per conversation.
//
// Conversation level state that is specific to a participant (unread count,
// notification preference, last read message, archive, mute, etc.) is stored
// here instead of the Conversation table.
// ============================================================================

import { sql } from "drizzle-orm";

import {
    boolean,
    check,
    index,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import { conversationsTable } from "../conversations";

import type { ConversationMemberMetadata } from "./metadata";

import {
    CONVERSATION_MEMBER_ROLES,
    CONVERSATION_MEMBER_STATUSES,
    CONVERSATION_NICKNAME_MAX_LENGTH,
    CONVERSATION_NOTIFICATION_PREFERENCES,
} from "./constants";

/**
 * ============================================================================
 * Enums
 * ============================================================================
 */

export const conversationMemberRoleEnum =
    pgEnum(
        "conversation_member_role",
        [...CONVERSATION_MEMBER_ROLES],
    );

export const conversationMemberStatusEnum =
    pgEnum(
        "conversation_member_status",
        [...CONVERSATION_MEMBER_STATUSES],
    );

export const conversationNotificationPreferenceEnum =
    pgEnum(
        "conversation_notification_preference",
        [
            ...CONVERSATION_NOTIFICATION_PREFERENCES,
        ],
    );

/**
 * ============================================================================
 * Conversation Members
 * ============================================================================
 */

export const conversationMembersTable =
    pgTable(
        "conversation_members",

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

            conversationId: uuid(
                "conversation_id",
            )
                .notNull()
                .references(
                    () => conversationsTable.id,
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
             * Member
             * ----------------------------------------------------------------------
             */

            role: conversationMemberRoleEnum(
                "role",
            )
                .default("SELLER")
                .notNull(),

            status:
                conversationMemberStatusEnum(
                    "status",
                )
                    .default("ACTIVE")
                    .notNull(),

            nickname: varchar("nickname", {
                length:
                CONVERSATION_NICKNAME_MAX_LENGTH,
            }),

            /**
             * ----------------------------------------------------------------------
             * Read State
             * ----------------------------------------------------------------------
             */

            unreadCount: integer(
                "unread_count",
            )
                .default(0)
                .notNull(),

            lastReadMessageId: uuid(
                "last_read_message_id",
            ),

            lastReadAt: timestamp(
                "last_read_at",
                {
                    withTimezone: true,
                },
            ),

            /**
             * ----------------------------------------------------------------------
             * Member Preferences
             * ----------------------------------------------------------------------
             */

            notificationPreference:
                conversationNotificationPreferenceEnum(
                    "notification_preference",
                )
                    .default("ALL_MESSAGES")
                    .notNull(),

            isPinned: boolean("is_pinned")
                .default(false)
                .notNull(),

            isMuted: boolean("is_muted")
                .default(false)
                .notNull(),

            isArchived: boolean(
                "is_archived",
            )
                .default(false)
                .notNull(),

            /**
             * ----------------------------------------------------------------------
             * Metadata
             * ----------------------------------------------------------------------
             */

            metadata: jsonb("metadata")
                .$type<ConversationMemberMetadata>()
                .default(sql`'{}'::jsonb`)
                .notNull(),

            /**
             * ----------------------------------------------------------------------
             * Audit
             * ----------------------------------------------------------------------
             */

            joinedAt: timestamp("joined_at", {
                withTimezone: true,
            })
                .defaultNow()
                .notNull(),

            leftAt: timestamp("left_at", {
                withTimezone: true,
            }),

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

            deletedAt: timestamp(
                "deleted_at",
                {
                    withTimezone: true,
                },
            ),
        },

        (table) => ({
            /**
             * ================================================================
             * Uniqueness
             * ================================================================
             */

            conversationMemberUniqueIdx:
                uniqueIndex(
                    "conversation_members_uidx",
                ).on(
                    table.conversationId,
                    table.sellerId,
                ),

            /**
             * ================================================================
             * Lookup Indexes
             * ================================================================
             */

            conversationIdx: index(
                "conversation_members_conversation_idx",
            ).on(table.conversationId),

            sellerIdx: index(
                "conversation_members_seller_idx",
            ).on(table.sellerId),

            roleIdx: index(
                "conversation_members_role_idx",
            ).on(table.role),

            statusIdx: index(
                "conversation_members_status_idx",
            ).on(table.status),

            joinedAtIdx: index(
                "conversation_members_joined_at_idx",
            ).on(table.joinedAt),

            /**
             * ================================================================
             * Checks
             * ================================================================
             */

            unreadCountCheck: check(
                "conversation_members_unread_count_chk",
                sql`${table.unreadCount} >= 0`,
            ),
        }),
    );