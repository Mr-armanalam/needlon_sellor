import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { relations } from "drizzle-orm";

export const userAddress = pgTable("user_address", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  pincode: text("pincode").notNull(),
  locality: text("locality").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  landmark: text("landmark").notNull(),
  alternate_phone: text("alternate_phone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userAddressRelation = relations(userAddress, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [userAddress.userId],
    references: [usersTable.id],
  }),
  address: many(userAddress)
}));
