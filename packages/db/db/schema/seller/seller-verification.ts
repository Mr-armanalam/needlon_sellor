import {
    pgTable,
    uuid,
    timestamp,
    text,
    pgEnum,
} from "drizzle-orm/pg-core";

import { seller } from "../seller";
import { usersTable } from "../users";

export const sellerVerificationStatusEnum = pgEnum(
    "seller_verification_status",
    [
        "NOT_SUBMITTED",
        "PENDING",
        "UNDER_REVIEW",
        "VERIFIED",
        "REJECTED",
        "EXPIRED",
    ],
);

export const sellerVerification = pgTable(
    "seller_verification",
    {
        sellerId: uuid("seller_id")
            .primaryKey()
            .references(() => seller.id, {
                onDelete: "cascade",
            }),

        status: sellerVerificationStatusEnum("status")
            .notNull()
            .default("NOT_SUBMITTED"),

        submittedAt: timestamp("submitted_at", {
            withTimezone: true,
        }),

        reviewStartedAt: timestamp("review_started_at", {
            withTimezone: true,
        }),

        verifiedAt: timestamp("verified_at", {
            withTimezone: true,
        }),

        reviewedBy: uuid("reviewed_by").references(
            () => usersTable.id,
            {
                onDelete: "set null",
            },
        ),

        rejectionReason: text("rejection_reason"),

        reviewNotes: text("review_notes"),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },
);