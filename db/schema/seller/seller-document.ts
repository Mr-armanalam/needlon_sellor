import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  bigint,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";
import { usersTable } from "../users"; // for admin verifier reference

// Enums
export const documentTypeEnum = pgEnum("document_type", [
  "GST",
  "PAN",
  "AADHAAR",
  "MSME",
  "FSSAI",
  "IEC",
  "TRADEMARK",
  "BUSINESS_REGISTRATION",
  "CANCELLED_CHEQUE",
  "OTHER",
  "ISO_CERTIFICATE",
  "SHOP_LICENSE",
  "DRUG_LICENSE",
  "EXPORT_LICENSE",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "PENDING",
  "UNDER_REVIEW",
  "VERIFIED",
  "REJECTED",
  "EXPIRED",
]);

export const verificationMethodEnum = pgEnum("verification_method", [
  "MANUAL",
  "API",
  "OCR",
  "THIRD_PARTY_KYC",
]);

export const sellerDocuments = pgTable("seller_documents", {
  id: uuid("id").defaultRandom().primaryKey(),

  sellerId: uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "restrict" }),

  documentType: documentTypeEnum("document_type").notNull(),
  documentNumber: varchar("document_number", { length: 100 }),
  documentName: varchar("document_name", { length: 255 }),

  fileUrl: text("file_url").notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  fileSizeBytes: bigint("file_size_bytes", { mode: "number" }),

  status: verificationStatusEnum("status").notNull().default("PENDING"),
  verificationMethod: verificationMethodEnum("verification_method")
    .notNull()
    .default("MANUAL"),

  verifiedBy: uuid("verified_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  rejectionReason: text("rejection_reason"),

  expiresAt: timestamp("expires_at", { withTimezone: true }),

  isPrimary: boolean("is_primary").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
