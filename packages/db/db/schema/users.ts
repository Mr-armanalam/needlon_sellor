import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { passwordResetTokens } from "./password-reset-tokens";


export const genderType = pgEnum("gender", [
  "male",
  "female"
]);


export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  imageUrl: text("image_url"),
  number: text('mobile_number'),
  gender: genderType('gender').notNull().default('male'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  passwordResetTokens: many(passwordResetTokens),
}));