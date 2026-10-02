import {
  pgTable,
  uuid,
  varchar,
  integer,
  bigint,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { messages } from "./messages"; // Reference to your messages master table

// 1. Defining Attachment Specific Structural Enums
export const attachmentTypeEnum = pgEnum("message_attachment_type", [
  "IMAGE",
  "DOCUMENT",
  "AUDIO",
  "VIDEO",
  "STICKER",
  "GIF",
  "CONTACT",
  "LOCATION",
]);

export const storageProviderEnum = pgEnum("message_storage_provider", [
  "R2",
  "S3",
  "GCS",
  "LOCAL",
]);

export const uploadStatusEnum = pgEnum("message_upload_status", [
  "PENDING",
  "UPLOADING",
  "COMPLETED",
  "FAILED",
  "QUARANTINED",
]);

// 2. Message Attachments Schema Configuration
export const messageAttachments = pgTable(
  "message_attachments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    messageId: uuid("message_id")
      .references(() => messages.id, { onDelete: "cascade" })
      .notNull(),

    attachmentType: attachmentTypeEnum("attachment_type").notNull(),
    storageProvider: storageProviderEnum("storage_provider").notNull(),
    storageKey: varchar("storage_key", { length: 500 }).notNull(),

    originalFilename: varchar("original_filename", { length: 255 }),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    fileSizeBytes: bigint("file_size_bytes", { mode: "number" }).notNull(),

    // Media Context Dimension Metadata
    width: integer("width"),
    height: integer("height"),
    durationSeconds: integer("duration_seconds"),

    // Storage Pre-rendering & Security Optimizations
    thumbnailStorageKey: varchar("thumbnail_storage_key", { length: 500 }),
    checksumSha256: varchar("checksum_sha256", { length: 64 }), // Hex digest length for SHA-256

    uploadStatus: uploadStatusEnum("upload_status")
      .default("COMPLETED")
      .notNull(),

    // Immutable Event Entry Time (No updated_at field present)
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      attachmentsMessageIdx: index("msg_attachments_message_idx").on(
        table.messageId,
      ),
    };
  },
);
