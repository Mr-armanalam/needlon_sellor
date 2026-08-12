// ============================================================================
// Needlon
// Reviews Module
// File: app/api/seller/reviews/route.ts
// Description: Seller reviews route handler
// Phase: 4.4 - 4.7
// ============================================================================

import { NextRequest } from "next/server";

import {
    routeHandler,
} from "@/modules/shared/api/route-handler";

import {
    successResponse,
} from "@/modules/shared/api/success-response";

import {
    getSellerProfile,
} from "@/modules/seller-profile/services";

import {
    listReviewsService,
} from "@/modules/reviews/services";

import {
    listReviewsQuerySchema,
} from "@/modules/reviews/validation/list-reviews-query-schema";

export async function GET(
    request: NextRequest,
) {
    return routeHandler(
        async () => {
            /**
             * ----------------------------------------------------------------
             * Authentication / Seller Context
             * ----------------------------------------------------------------
             *
             * The existing seller-profile service resolves the authenticated
             * seller context used by seller-facing APIs.
             *
             * The seller identifier is never accepted from the client query.
             * ----------------------------------------------------------------
             */

            const profile =
                await getSellerProfile();

            /**
             * ----------------------------------------------------------------
             * Request Query Validation
             * ----------------------------------------------------------------
             */

            const searchParams =
                request.nextUrl.searchParams;

            const parsed =
                listReviewsQuerySchema.safeParse(
                    {
                        page:
                            searchParams.get(
                                "page",
                            ) ?? undefined,

                        limit:
                            searchParams.get(
                                "limit",
                            ) ?? undefined,

                        search:
                            searchParams.get(
                                "search",
                            ) ?? undefined,

                        rating:
                            searchParams.get(
                                "rating",
                            ) ?? undefined,
                    },
                );

            if (
                !parsed.success
            ) {
                throw parsed.error;
            }

            /**
             * ----------------------------------------------------------------
             * Application Service
             * ----------------------------------------------------------------
             *
             * sellerId originates from the authenticated seller context.
             * Client-controlled seller identifiers are not trusted.
             * ----------------------------------------------------------------
             */

            const reviews =
                await listReviewsService(
                    {
                        sellerId:
                        profile.id,

                        page:
                        parsed.data.page,

                        limit:
                        parsed.data.limit,

                        search:
                        parsed.data.search,

                        rating:
                        parsed.data.rating,
                    },
                );

            /**
             * ----------------------------------------------------------------
             * Standard API Response
             * ----------------------------------------------------------------
             */

            return successResponse(
                reviews,
            );
        },
    );
}