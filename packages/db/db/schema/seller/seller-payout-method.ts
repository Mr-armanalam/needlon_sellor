import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";
import { sellerBankAccounts } from "./seller-bank-account";

// Enums
export const payoutMethodTypeEnum = pgEnum("payout_method_type", [
  "BANK_TRANSFER",
  "UPI",
  "RAZORPAYX",
  "STRIPE_CONNECT",
  "WISE",
  "PAYPAL",
  "PAYONEER",
  "OTHER",
]);

export const payoutVerificationStatusEnum = pgEnum("payout_verification_status", [
  "PENDING",
  "VERIFIED",
  "REJECTED",
  "DISABLED",
]);

export const sellerPayoutMethods = pgTable("seller_payout_methods", {
  id: uuid("id").defaultRandom().primaryKey(),

  sellerId: uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "restrict" }),

  methodType: payoutMethodTypeEnum("method_type").notNull(),

  bankAccountId: uuid("bank_account_id").references(() => sellerBankAccounts.id, { onDelete: "set null" }),

  providerName: varchar("provider_name", { length: 100 }),
  providerAccountId: varchar("provider_account_id", { length: 255 }),

  upiId: varchar("upi_id", { length: 255 }),

  verificationStatus: payoutVerificationStatusEnum("verification_status").notNull().default("PENDING"),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),

  isDefault: boolean("is_default").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),

  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
