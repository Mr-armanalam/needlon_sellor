import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";
import { usersTable } from "../users"; // for admin verifier reference

// Enums
export const accountTypeEnum = pgEnum("account_type", [
  "SAVINGS",
  "CURRENT",
  "NRE",
  "NRO",
  "BUSINESS",
]);

export const verificationStatusEnum = pgEnum("bank_verification_status", [
  "PENDING",
  "IN_REVIEW",
  "VERIFIED",
  "REJECTED",
  "SUSPENDED",
]);

export const verificationMethodEnum = pgEnum("bank_verification_method", [
  "MANUAL",
  "PENNY_DROP",
  "BANK_API",
  "THIRD_PARTY",
]);

export const sellerBankAccounts = pgTable("seller_bank_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),

  sellerId: uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "restrict" }),

  accountHolderName: varchar("account_holder_name", { length: 200 }).notNull(),
  bankName: varchar("bank_name", { length: 200 }).notNull(),

  accountNumber: text("account_number").notNull(), // encrypted
  accountNumberLast4: varchar("account_number_last4", { length: 4 }).notNull(),

  ifscCode: varchar("ifsc_code", { length: 20 }).notNull(),
  branchName: varchar("branch_name", { length: 200 }),

  accountType: accountTypeEnum("account_type").notNull().default("SAVINGS"),

  verificationStatus: verificationStatusEnum("verification_status")
    .notNull()
    .default("PENDING"),
  verificationMethod: verificationMethodEnum("verification_method")
    .notNull()
    .default("MANUAL"),

  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  verifiedBy: uuid("verified_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),

  isPrimary: boolean("is_primary").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),

  notes: text("notes"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
