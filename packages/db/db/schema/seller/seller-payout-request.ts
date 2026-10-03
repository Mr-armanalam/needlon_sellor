import {
  pgTable,
  uuid,
  varchar,
  numeric,
  text,
  timestamp,
  pgEnum,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";
import { sellerBankAccounts } from "./seller-bank-account";

export const payoutRequestStatusEnum = pgEnum("payout_request_status", [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "REJECTED",
  "CANCELLED",
]);

export const sellerPayoutRequests = pgTable(
  "seller_payout_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    sellerId: uuid("seller_id")
      .notNull()
      .references(() => seller.id, { onDelete: "restrict" }),

    bankAccountId: uuid("bank_account_id").references(
      () => sellerBankAccounts.id,
      { onDelete: "set null" }
    ),

    payoutNumber: varchar("payout_number", { length: 50 }).notNull().unique(),

    amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),

    currency: varchar("currency", { length: 10 }).notNull().default("INR"),

    status: payoutRequestStatusEnum("status").notNull().default("PENDING"),

    gateway: varchar("gateway", { length: 50 }).notNull().default("STRIPE_TEST"),

    gatewayPayoutId: varchar("gateway_payout_id", { length: 255 }),

    gatewayResponse: jsonb("gateway_response"),

    failureReason: text("failure_reason"),

    notes: text("notes"),

    requestedAt: timestamp("requested_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    processedAt: timestamp("processed_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    sellerIdx: index("seller_payout_requests_seller_idx").on(table.sellerId),
    statusIdx: index("seller_payout_requests_status_idx").on(table.status),
    requestedAtIdx: index("seller_payout_requests_requested_at_idx").on(
      table.requestedAt
    ),
  })
);

export type SellerPayoutRequest = typeof sellerPayoutRequests.$inferSelect;
export type NewSellerPayoutRequest = typeof sellerPayoutRequests.$inferInsert;
