import {
  pgTable,
  uuid,
  varchar,
  integer,
  bigint,
  smallint,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { reviews } from "./reviews"; // Reference to your reviews table

// Reusing or declaring storage providers based on your architecture pattern
export const reviewMediaTypeEnum = pgEnum("review_media_type", [
  "IMAGE",
  "VIDEO",
]);
export const reviewStorageProviderEnum = pgEnum("review_storage_provider", [
  "R2",
  "S3",
  "GCS",
  "LOCAL",
]);
export const reviewMediaStatusEnum = pgEnum("review_media_status", [
  "ACTIVE",
  "PENDING_MODERATION",
  "HIDDEN",
  "REJECTED",
]);

export const reviewImages = pgTable(
  "review_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reviewId: uuid("review_id")
      .references(() => reviews.id, { onDelete: "cascade" })
      .notNull(),

    mediaType: reviewMediaTypeEnum("media_type").default("IMAGE").notNull(),
    storageProvider: reviewStorageProviderEnum("storage_provider")
      .default("R2")
      .notNull(),
    storageKey: varchar("storage_key", { length: 500 }).notNull(),
    thumbnailStorageKey: varchar("thumbnail_storage_key", { length: 500 }),

    originalFilename: varchar("original_filename", { length: 255 }),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    fileSizeBytes: bigint("file_size_bytes", { mode: "number" }).notNull(),

    // Dimensions and properties
    width: integer("width"),
    height: integer("height"),
    durationSeconds: integer("duration_seconds"), // Reserved for future video features

    checksumSha256: varchar("checksum_sha256", { length: 64 }),
    displayOrder: smallint("display_order").default(1).notNull(),
    status: reviewMediaStatusEnum("status").default("ACTIVE").notNull(),

    // Immutable ledger tracking timestamp
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      reviewImagesParentIdx: index("review_images_parent_idx").on(
        table.reviewId,
        table.displayOrder,
      ),
    };
  },
);
