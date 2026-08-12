
import {
    and,
    desc,
    eq,
    ilike,
    isNull,
    or,
    sql,
} from "drizzle-orm";

import { getDatabase } from "@/db/database";
import type { DbTransaction } from "@/db/transactions";

import { reviewsTable } from "@/db/schema/reviews";
import { usersTable } from "@/db/schema/users";
import { productsTable } from "@/db/schema/catalog/products/table";
import { sellerReviewResponsesTable } from "@/db/schema/reviews/review-response/table";

interface ListSellerReviewsParams {
    sellerId: string;

    page?: number;

    limit?: number;

    search?: string;

    rating?: number;

    tx?: DbTransaction;
}

export async function listSellerReviews({
                                            sellerId,
                                            page = 1,
                                            limit = 20,
                                            search,
                                            rating,
                                            tx,
                                        }: ListSellerReviewsParams) {
    const database = getDatabase(tx);

    /**
     * ------------------------------------------------------------------------
     * Pagination
     * ------------------------------------------------------------------------
     */

    const normalizedPage =
        Math.max(1, page);

    const normalizedLimit =
        Math.min(
            100,
            Math.max(1, limit),
        );

    const offset =
        (normalizedPage - 1) *
        normalizedLimit;

    /**
     * ------------------------------------------------------------------------
     * Seller Ownership
     * ------------------------------------------------------------------------
     *
     * The seller scope is mandatory.
     *
     * A review can only be returned when its sellerId matches
     * the authenticated seller scope supplied by the caller.
     *
     * Soft-deleted reviews are excluded.
     * ------------------------------------------------------------------------
     */

    const conditions = [
        eq(
            reviewsTable.sellerId,
            sellerId,
        ),

        isNull(
            reviewsTable.deletedAt,
        ),
    ];

    /**
     * ------------------------------------------------------------------------
     * Rating Filter
     * ------------------------------------------------------------------------
     */

    if (
        rating !== undefined
    ) {
        conditions.push(
            eq(
                reviewsTable.rating,
                rating,
            ),
        );
    }

    /**
     * ------------------------------------------------------------------------
     * Search
     * ------------------------------------------------------------------------
     *
     * Search applies to:
     *
     * - Review title
     * - Review content
     * - Buyer name
     * ------------------------------------------------------------------------
     */

    if (
        search?.trim()
    ) {
        const searchTerm =
            `%${search.trim()}%`;

        conditions.push(
            or(
                ilike(
                    reviewsTable.title,
                    searchTerm,
                ),

                ilike(
                    reviewsTable.content,
                    searchTerm,
                ),

                ilike(
                    usersTable.name,
                    searchTerm,
                ),
            )!,
        );
    }

    const whereClause =
        and(...conditions);

    /**
     * ------------------------------------------------------------------------
     * Review Ordering
     * ------------------------------------------------------------------------
     *
     * Newest reviews are returned first.
     *
     * The review creation timestamp is the canonical ordering field for
     * the seller review list.
     * ------------------------------------------------------------------------
     */

    const items =
        await database
            .select({
                id:
                reviewsTable.id,

                sellerId:
                reviewsTable.sellerId,

                buyerId:
                reviewsTable.buyerId,

                productId:
                reviewsTable.productId,

                rating:
                reviewsTable.rating,

                title:
                reviewsTable.title,

                content:
                reviewsTable.content,

                status:
                reviewsTable.status,

                createdAt:
                reviewsTable.createdAt,

                updatedAt:
                reviewsTable.updatedAt,

                reply:
                sellerReviewResponsesTable.content,

                /**
                 * ------------------------------------------------------------
                 * Buyer
                 * ------------------------------------------------------------
                 */

                buyer: {
                    id:
                    usersTable.id,

                    name:
                    usersTable.name,

                    email:
                    usersTable.email,

                    imageUrl:
                    usersTable.imageUrl,
                },

                /**
                 * ------------------------------------------------------------
                 * Product
                 * ------------------------------------------------------------
                 */

                product: {
                    id:
                    productsTable.id,

                    name:
                    productsTable.name,

                    slug:
                    productsTable.slug,
                },
            })
            .from(reviewsTable)

            /**
             * Buyer relationship.
             */
            .innerJoin(
                usersTable,
                eq(
                    reviewsTable.buyerId,
                    usersTable.id,
                ),
            )

            /**
             * Product relationship.
             */
            .innerJoin(
                productsTable,
                eq(
                    reviewsTable.productId,
                    productsTable.id,
                ),
            )

            /**
             * Response relationship.
             */
            .leftJoin(
                sellerReviewResponsesTable,
                eq(
                    reviewsTable.id,
                    sellerReviewResponsesTable.reviewId,
                ),
            )

            /**
             * ------------------------------------------------------------
             * Ordering
             * ------------------------------------------------------------
             */

            .where(
                whereClause,
            )

            .orderBy(
                desc(
                    reviewsTable.createdAt,
                ),
            )

            /**
             * ------------------------------------------------------------
             * Pagination
             * ------------------------------------------------------------
             */

            .limit(
                normalizedLimit,
            )

            .offset(
                offset,
            );

    /**
     * ------------------------------------------------------------------------
     * Total Count
     * ------------------------------------------------------------------------
     *
     * Count uses the same seller scope and filters as the list query so
     * pagination metadata always represents the same result set.
     * ------------------------------------------------------------------------
     */

    const [
        countResult,
    ] =
        await database
            .select({
                count: sql<number>`
                    count(*)::int
                `,
            })
            .from(reviewsTable)

            .innerJoin(
                usersTable,
                eq(
                    reviewsTable.buyerId,
                    usersTable.id,
                ),
            )

            .innerJoin(
                productsTable,
                eq(
                    reviewsTable.productId,
                    productsTable.id,
                ),
            )

            .where(
                whereClause,
            );

    const total =
        countResult?.count ?? 0;

    /**
     * ------------------------------------------------------------------------
     * Result
     * ------------------------------------------------------------------------
     */

    return {
        items,

        pagination: {
            page:
            normalizedPage,

            limit:
            normalizedLimit,

            total,

            totalPages:
                Math.ceil(
                    total /
                    normalizedLimit,
                ),
        },
    };
}