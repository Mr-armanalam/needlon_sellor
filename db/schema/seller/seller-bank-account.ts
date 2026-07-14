import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum, index, uniqueIndex,
  check
} from "drizzle-orm/pg-core";
import { seller } from "../seller";
import { usersTable } from "../users";
import {sql} from "drizzle-orm"; // for admin verifier reference

// Enums
export const accountTypeEnum = pgEnum("account_type", [
  "SAVINGS",
  "CURRENT",
  "NRE",
  "NRO",
  "BUSINESS",
]);

export const bankVerificationStatusEnum = pgEnum("bank_verification_status", [
  "PENDING",
  "IN_REVIEW",
  "VERIFIED",
  "REJECTED",
  "SUSPENDED",
  "FAILED"
]);


export const bankVerificationMethodEnum = pgEnum("bank_verification_method", [
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

      verificationStatus: bankVerificationStatusEnum("verification_status")
          .notNull()
          .default("PENDING"),
      verificationMethod: bankVerificationMethodEnum("verification_method")
          .notNull()
          .default("MANUAL"),

      verifiedAt: timestamp("verified_at", { withTimezone: true }),
      verifiedBy: uuid("verified_by").references(() => usersTable.id, {
        onDelete: "set null",
      }),

      isPrimary: boolean("is_primary").notNull().default(false),
      upiId: varchar('upi_id', { length: 255 }).unique(),
      isActive: boolean("is_active").notNull().default(true),

      notes: text("notes"),

      createdAt: timestamp("created_at", { withTimezone: true })
          .defaultNow()
          .notNull(),
      updatedAt: timestamp("updated_at", { withTimezone: true })
          .defaultNow()
          .notNull(),
      deletedAt: timestamp("deleted_at", { withTimezone: true }),
    },
    (table) => ({
      sellerIndex: index(
          "seller_bank_accounts_seller_idx",
      ).on(table.sellerId),

      activeIndex: index(
          "seller_bank_accounts_active_idx",
      ).on(
          table.sellerId,
          table.isActive,
      ),

      primaryPerSeller: uniqueIndex(
          "unique_primary_account_per_seller",
      )
          .on(table.sellerId)
          .where(
              sql`${table.isPrimary} = true`,
          ),

      upi_idCheck: check(
          'seller_bank_accounts_upi_id_check',
          sql`${table.upiId} IS NULL OR ${table.upiId} ~* '^[a-zA-Z0-9.\\-_]+@[a-zA-Z0-9.\\-_]+$'`
      ),
    }),
);
