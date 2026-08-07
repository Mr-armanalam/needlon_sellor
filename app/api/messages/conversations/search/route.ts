// ============================================================================
// Needlon
// Messages API
// File: app/api/messages/conversations/search/route.ts
// Description:
// Conversation search API.
// Searches conversations belonging to the authenticated seller.
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
    conversationService,
} from "@/modules/message/service";

const SEARCH_QUERY_PARAMETER =
    "q";

const MAX_SEARCH_QUERY_LENGTH =
    100;

/**
 * ============================================================================
 * GET /api/messages/conversations/search?q=<query>
 * ============================================================================
 *
 * Searches the authenticated seller's conversations.
 */
export async function GET(
    request: NextRequest,
) {
    return routeHandler(
        async () => {
            const query =
                request.nextUrl.searchParams
                    .get(
                        SEARCH_QUERY_PARAMETER,
                    )
                    ?.trim() ?? "";

            if (
                query.length === 0
            ) {
                return successResponse(
                    [],
                );
            }

            if (
                query.length >
                MAX_SEARCH_QUERY_LENGTH
            ) {
                throw new Error(
                    `Search query must not exceed ${MAX_SEARCH_QUERY_LENGTH} characters.`,
                );
            }

            const sellerProfile =
                await getSellerProfile();

            const conversations =
                await conversationService.searchConversations(
                    sellerProfile.sellerId,
                    query,
                );

            return successResponse(
                conversations,
            );
        },
    );
}