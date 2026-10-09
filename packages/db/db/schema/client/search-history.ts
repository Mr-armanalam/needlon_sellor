import { pgTable, uuid, varchar, integer, timestamp, index } from "drizzle-orm/pg-core";
import { usersTable } from "../users";

export const clientSearchHistoryTable = pgTable(
  "client_search_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
    query: varchar("query", { length: 255 }).notNull(),
    searchCount: integer("search_count").default(1).notNull(),
    lastSearchedAt: timestamp("last_searched_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userQueryIdx: index("client_search_history_user_idx").on(table.userId),
    queryIdx: index("client_search_history_query_idx").on(table.query),
  })
);

export type ClientSearchHistory = typeof clientSearchHistoryTable.$inferSelect;
export type NewClientSearchHistory = typeof clientSearchHistoryTable.$inferInsert;
