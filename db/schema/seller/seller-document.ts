import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { seller } from "../seller";
import { usersTable } from "../users";

export const sellerDocumentTypeEnum = pgEnum("document_type", [
  "GST",
  "PAN",
  "AADHAAR",
  "MSME",
  "FSSAI",
  "IEC",
  "TRADEMARK",
  "BUSINESS_REGISTRATION",
  "SHOP_LICENSE",
  "DRUG_LICENSE",
  "EXPORT_LICENSE",
  "ISO_CERTIFICATE",
  "CANCELLED_CHEQUE",
  "OTHER",
]);

export const sellerDocumentStatusEnum = pgEnum(
    "document_status",
    [
      "UPLOADED",
      "PENDING_REVIEW",
      "UNDER_REVIEW",
      "VERIFIED",
      "REJECTED",
      "EXPIRED",
    ],
);

export const sellerDocumentVerificationMethodEnum = pgEnum(
    "verification_method",
    [
      "MANUAL",
      "OCR",
      "API",
      "THIRD_PARTY_KYC",
    ],
);

export const sellerDocuments = pgTable(
    "seller_documents",
    {
      id: uuid("id")
          .defaultRandom()
          .primaryKey(),

      sellerId: uuid("seller_id")
          .notNull()
          .references(() => seller.id, {
            onDelete: "restrict",
          }),

      documentType: sellerDocumentTypeEnum(
          "document_type",
      ).notNull(),

      documentName: varchar(
          "document_name",
          { length: 255 },
      ),

      documentNumber: varchar(
          "document_number",
          { length: 100 },
      ),

      fileUrl: text("file_url").notNull(),

      mimeType: varchar("mime_type", {
        length: 100,
      }),

      fileSizeBytes: bigint(
          "file_size_bytes",
          {
            mode: "number",
          },
      ),

      version: integer("version")
          .notNull()
          .default(1),

      status: sellerDocumentStatusEnum("status")
          .notNull()
          .default("UPLOADED"),

      verificationMethod:
          sellerDocumentVerificationMethodEnum(
              "verification_method",
          )
              .notNull()
              .default("MANUAL"),

      reviewNotes: text("review_notes"),

      rejectionReason: text(
          "rejection_reason",
      ),

      metadata: jsonb("metadata"),

      verifiedBy: uuid("verified_by")
          .references(() => usersTable.id, {
            onDelete: "set null",
          }),

      verifiedAt: timestamp(
          "verified_at",
          {
            withTimezone: true,
          },
      ),

      expiresAt: timestamp(
          "expires_at",
          {
            withTimezone: true,
          },
      ),

      isPrimary: boolean("is_primary")
          .notNull()
          .default(true),

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
      sellerIdx: index(
          "seller_documents_seller_idx",
      ).on(table.sellerId),

      statusIdx: index(
          "seller_documents_status_idx",
      ).on(table.status),

      typeIdx: index(
          "seller_documents_type_idx",
      ).on(table.documentType),
    }),
);