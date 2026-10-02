import {
  pgTable,
  uuid,
  smallint,
  boolean,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";

// Enums
export const onboardingStepEnum = pgEnum("onboarding_step", [
  "EMAIL_VERIFICATION",
  "PHONE_VERIFICATION",
  "PROFILE",
  "BUSINESS_DETAILS",
  "STORE",
  "ADDRESS",
  "DOCUMENTS",
  "BANK_ACCOUNT",
  "SUBSCRIPTION",
  "STORE_REVIEW",
  "COMPLETED",
]);

export const sellerOnboardingProgress = pgTable("seller_onboarding_progress", {
  sellerId: uuid("seller_id")
    .primaryKey()
    .references(() => seller.id, { onDelete: "cascade" }),

  currentStep: onboardingStepEnum("current_step").notNull().default("PROFILE"),
  completedSteps: jsonb("completed_steps").notNull().default("[]"),

  completionPercentage: smallint("completion_percentage").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),

  completedAt: timestamp("completed_at", { withTimezone: true }),
  lastStepAt: timestamp("last_step_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
