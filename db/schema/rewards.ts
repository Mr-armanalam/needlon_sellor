import {
  date,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { coupons } from "./coupons";

export const statusEnum = pgEnum("status_type", [
  "active",
  "upcoming",
  "expired",
]);

export const rewardSchema = pgTable("rewards_schema", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupon_id: uuid("coupon_id")
    .notNull()
    .references(() => coupons.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  discount: text("discount").notNull(),
  discription: text("discription").notNull(),
  gradient: text("gradient_color")
    .notNull()
    .default("from-purple-500 to-pink-500"),
  status: statusEnum().default("upcoming"),
  validFrom: date("valide_from").defaultNow().notNull(),
  validTo: date("valide_to").notNull(),
  createdAt: timestamp("createdat").defaultNow(),
});

export const rewardSchemaRelation = relations(rewardSchema, ({ one }) => ({
  coupon: one(coupons, {
    fields: [rewardSchema.coupon_id],
    references: [coupons.id],
  }),
}));
