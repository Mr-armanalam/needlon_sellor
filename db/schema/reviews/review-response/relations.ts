import {
    relations,
} from "drizzle-orm";

import {
    reviewsTable,
} from "./table";

import {
    sellerReviewResponsesTable,
} from "./review-response";

import {
    seller,
} from "@/db/schema/seller";

export const sellerReviewResponsesRelations =
    relations(
        sellerReviewResponsesTable,
        ({
             one,
         }) => ({
            review:
                one(
                    reviewsTable,
                    {
                        fields: [
                            sellerReviewResponsesTable.reviewId,
                        ],

                        references: [
                            reviewsTable.id,
                        ],
                    },
                ),

            seller:
                one(
                    seller,
                    {
                        fields: [
                            sellerReviewResponsesTable.sellerId,
                        ],

                        references: [
                            seller.id,
                        ],
                    },
                ),
        }),
    );

