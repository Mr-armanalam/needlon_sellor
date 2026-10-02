import {
  pgTable,
  uuid,
  varchar,
  text,
  smallint,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { subscriptionPlans } from "./sucbscription-plan";

// Enums
export const featureTypeEnum = pgEnum("feature_type", [
  "BOOLEAN",
  "INTEGER",
  "DECIMAL",
  "STRING",
  "JSON",
]);

export const subscriptionPlanFeatures = pgTable("subscription_plan_features", {
  id: uuid("id").defaultRandom().primaryKey(),

  planId: uuid("plan_id")
    .notNull()
    .references(() => subscriptionPlans.id, { onDelete: "cascade" }),

  featureKey: varchar("feature_key", { length: 100 }).notNull(),
  featureName: varchar("feature_name", { length: 150 }).notNull(),

  featureType: featureTypeEnum("feature_type").notNull(),
  featureValue: varchar("feature_value", { length: 255 }).notNull(),

  description: text("description"),

  displayOrder: smallint("display_order").notNull().default(1),
  isVisible: boolean("is_visible").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
