import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { cartItems } from "./cart-items";
import { wishListItems } from "./wishlist-items";
import { userAddress } from "./user-address";
import { orders } from "./orders";
import { productReview } from "./product-review";
import { rewardSchema } from "./rewards";
import { updateSchema } from "./updates";
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
  cartItems: many(cartItems),
  wishlistItems: many(wishListItems),
  userAddress: many(userAddress),
  Orders: many(orders),
  review: many(productReview),
  updates: many(updateSchema),
  passwordResetTokens: many(passwordResetTokens),
}));