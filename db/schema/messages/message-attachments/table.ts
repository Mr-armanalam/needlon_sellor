// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/message-attachments/table.ts
// Description:
// Stores all files attached to a message.
//
// One message can have multiple attachments.
// Attachments are immutable after upload.
// ============================================================================

import { sql } from "drizzle-orm";

import {
    bigint,
    check,
    index,
    jsonb,
    pgEnum,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { messagesTable } from "../messages";

import type { MessageAttachmentMetadata } from "./metadata";

import {
    MESSAGE_ATTACHMENT_BUCKET_NAME_MAX_LENGTH,
    MESSAGE_ATTACHMENT_CHECKSUM_MAX_LENGTH,
    MESSAGE_ATTACHMENT_CONTENT_TYPE_MAX_LENGTH,
    MESSAGE_ATTACHMENT_FILE_NAME_MAX_LENGTH,
    MESSAGE_ATTACHMENT_ORIGINAL_NAME_MAX_LENGTH,
    MESSAGE_ATTACHMENT_STATUSES,
    MESSAGE_ATTACHMENT_STORAGE_PATH_MAX_LENGTH,
    MESSAGE_ATTACHMENT_STORAGE_PROVIDERS,
    MESSAGE_ATTACHMENT_TYPES,
} from "./constants";

/**
 * ============================================================================
 * Enums
 * ============================================================================
 */

export const messageAttachmentTypeEnum =
    pgEnum(
        "message_attachment_type",
        [...MESSAGE_ATTACHMENT_TYPES],
    );

export const messageAttachmentStatusEnum =
    pgEnum(
        "message_attachment_status",
        [...MESSAGE_ATTACHMENT_STATUSES],
    );

export const messageAttachmentStorageProviderEnum =
    pgEnum(
        "message_attachment_storage_provider",
        [
            ...MESSAGE_ATTACHMENT_STORAGE_PROVIDERS,
        ],
    );

/**
 * ============================================================================
 * Message Attachments
 * ============================================================================
 */

export const messageAttachmentsTable =
    pgTable(
        "message_attachments",
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
             * Message
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

            /**
             * ----------------------------------------------------------------------
             * Attachment
             * ----------------------------------------------------------------------
             */

            type: messageAttachmentTypeEnum(
                "type",
            )
                .default("IMAGE")
                .notNull(),

            status:
                messageAttachmentStatusEnum(
                    "status",
                )
                    .default("UPLOADING")
                    .notNull(),

            storageProvider:
                messageAttachmentStorageProviderEnum(
                    "storage_provider",
                )
                    .default("SUPABASE")
                    .notNull(),

            /**
             * ----------------------------------------------------------------------
             * File
             * ----------------------------------------------------------------------
             */

            fileName: varchar("file_name", {
                length:
                MESSAGE_ATTACHMENT_FILE_NAME_MAX_LENGTH,
            }).notNull(),

            originalFileName: varchar(
                "original_file_name",
                {
                    length:
                    MESSAGE_ATTACHMENT_ORIGINAL_NAME_MAX_LENGTH,
                },
            ).notNull(),

            bucket: varchar("bucket", {
                length:
                MESSAGE_ATTACHMENT_BUCKET_NAME_MAX_LENGTH,
            }).notNull(),

            storagePath: varchar(
                "storage_path",
                {
                    length:
                    MESSAGE_ATTACHMENT_STORAGE_PATH_MAX_LENGTH,
                },
            ).notNull(),

            contentType: varchar(
                "content_type",
                {
                    length:
                    MESSAGE_ATTACHMENT_CONTENT_TYPE_MAX_LENGTH,
                },
            ).notNull(),

            fileSize: bigint("file_size", {
                mode: "number",
            }).notNull(),

            checksum: varchar(
                "checksum",
                {
                    length:
                    MESSAGE_ATTACHMENT_CHECKSUM_MAX_LENGTH,
                },
            ),

            /**
             * ----------------------------------------------------------------------
             * Metadata
             * ----------------------------------------------------------------------
             */

            metadata: jsonb("metadata")
                .$type<MessageAttachmentMetadata>()
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
             * Lookup Indexes
             * ================================================================
             */

            messageIdx: index(
                "message_attachments_message_idx",
            ).on(table.messageId),

            typeIdx: index(
                "message_attachments_type_idx",
            ).on(table.type),

            statusIdx: index(
                "message_attachments_status_idx",
            ).on(table.status),

            storageProviderIdx: index(
                "message_attachments_storage_provider_idx",
            ).on(table.storageProvider),

            createdAtIdx: index(
                "message_attachments_created_at_idx",
            ).on(table.createdAt),

            /**
             * ================================================================
             * Checks
             * ================================================================
             */

            fileSizeCheck: check(
                "message_attachments_file_size_chk",
                sql`${table.fileSize} > 0`,
            ),
        }),
    );