import {
    index,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import {
    seller,
} from "@/db/schema/seller";

import {
    reviewsTable,
} from "../table";

import {
    REVIEW_REPORT_REASON_MAX_LENGTH,
} from "../review-reports/constants";

export const reviewReportsTable = pgTable(
    "review_reports",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        reviewId: uuid("review_id")
            .notNull()
            .references(
                () => reviewsTable.id,
                {
                    onDelete: "restrict",
                    onUpdate: "cascade",
                },
            ),

        sellerId: uuid("seller_id")
            .notNull()
            .references(
                () => seller.id,
                {
                    onDelete: "restrict",
                    onUpdate: "cascade",
                },
            ),

        reason: varchar(
            "reason",
            {
                length:
                REVIEW_REPORT_REASON_MAX_LENGTH,
            },
        )
            .notNull(),

        status: varchar(
            "status",
            {
                length: 50,
            },
        )
            .notNull()
            .default("PENDING"),

        createdAt: timestamp(
            "created_at",
            {
                withTimezone: true,
            },
        )
            .defaultNow()
            .notNull(),

        updatedAt: timestamp(
            "updated_at",
            {
                withTimezone: true,
            },
        )
            .defaultNow()
            .$onUpdate(
                () => new Date(),
            )
            .notNull(),
    },

    (table) => ({
        reviewLookupIdx: index(
            "review_reports_review_idx",
        ).on(
            table.reviewId,
        ),

        sellerLookupIdx: index(
            "review_reports_seller_idx",
        ).on(
            table.sellerId,
        ),

        statusIdx: index(
            "review_reports_status_idx",
        ).on(
            table.status,
        ),

        reviewStatusIdx: index(
            "review_reports_review_status_idx",
        ).on(
            table.reviewId,
            table.status,
        ),

        sellerStatusIdx: index(
            "review_reports_seller_status_idx",
        ).on(
            table.sellerId,
            table.status,
        ),
    }),
);

