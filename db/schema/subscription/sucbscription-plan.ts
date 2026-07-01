import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  smallint,
  boolean,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Enums
export const billingTypeEnum = pgEnum("billing_type", [
  "TRIAL",
  "MONTHLY",
  "YEARLY",
  "QUARTERLY",
  "HALF_YEARLY",
]);

export const subscriptionPlans = pgTable(
  "subscription_plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    planCode: varchar("plan_code", { length: 50 }).notNull(),
    planName: varchar("plan_name", { length: 100 }).notNull(),
    description: text("description"),

    billingType: billingTypeEnum("billing_type").notNull().default("MONTHLY"),

    price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
    currencyCode: varchar("currency_code", { length: 3 })
      .notNull()
      .default("INR"),

    trialDays: smallint("trial_days").notNull().default(40),
    displayOrder: smallint("display_order").notNull().default(1),

    isPopular: boolean("is_popular").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),

    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("subscription_plan_code_unique_idx").on(table.planCode),
    uniqueIndex("subscription_plan_name_unique_idx").on(table.planName),
  ],
);
