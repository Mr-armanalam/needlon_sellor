import {
    relations,
} from "drizzle-orm";

import {
    reviewsTable,
} from "../table";

import {
    reviewReportsTable,
} from "../review-reports/table";

import {
    seller,
} from "@/db/schema/seller";

export const reviewReportsRelations =
    relations(
        reviewReportsTable,
        ({
             one,
         }) => ({
            review: one(
                reviewsTable,
                {
                    fields: [
                        reviewReportsTable.reviewId,
                    ],
                    references: [
                        reviewsTable.id,
                    ],
                },
            ),

            seller: one(
                seller,
                {
                    fields: [
                        reviewReportsTable.sellerId,
                    ],
                    references: [
                        seller.id,
                    ],
                },
            ),
        }),
    );
