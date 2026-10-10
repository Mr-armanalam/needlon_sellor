import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "../users";

export const clientLoyaltyAccountsTable = pgTable("client_loyalty_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique().references(() => usersTable.id, { onDelete: "cascade" }),
  pointsBalance: integer("points_balance").default(0).notNull(),
  tier: varchar("tier", { length: 50 }).default("BRONZE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ClientLoyaltyAccount = typeof clientLoyaltyAccountsTable.$inferSelect;
export type NewClientLoyaltyAccount = typeof clientLoyaltyAccountsTable.$inferInsert;
