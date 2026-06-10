import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { relations } from "drizzle-orm";

export const updateSchema = pgTable("update_schema", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("update_type").notNull(),
  time: timestamp("notification_time").defaultNow().notNull(),
  read: boolean("is_readed").default(false).notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const updateSchemaRelation = relations(updateSchema, ({ one }) => ({
  user: one(usersTable, {
    fields: [updateSchema.userId],
    references: [usersTable.id],
  }),
}));
