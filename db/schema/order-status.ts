import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const orderStatus = pgTable("order_status", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  details: text("details").array(),
  isActive: boolean("isActive"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});


