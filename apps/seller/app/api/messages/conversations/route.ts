// ============================================================================
// Needlon
// Messages API
// File: app/api/messages/conversations/route.ts
// Description:
// Conversation collection API.
// Supports listing the authenticated seller's conversations and creating
// a new conversation.
// ============================================================================

import { NextRequest } from "next/server";

import {
    routeHandler,
} from "@/modules/shared/api/route-handler";

import {
    successResponse,
} from "@/modules/shared/api/success-response";

import {
    parseBody,
} from "@/modules/shared/api/parse-body";

import {
    getSellerProfile,
} from "@/modules/seller-profile/services";

import {
    conversationService,
} from "@/modules/message/service";

import {
    createConversationSchema,
} from "@/modules/message/validation";

/**
 * ============================================================================
 * GET /api/messages/conversations
 * ============================================================================
 *
 * Returns conversations belonging to the authenticated seller.
 */
export async function GET() {
    return routeHandler(
        async () => {
            const sellerProfile =
                await getSellerProfile();

            const conversations =
                await conversationService.getSellerConversations(
                    sellerProfile.sellerId,
                );

            return successResponse(
                conversations,
            );
        },
    );
}

/**
 * ============================================================================
 * POST /api/messages/conversations
 * ============================================================================
 *
 * Creates a new conversation for the authenticated seller.
 */
export async function POST(
    request: NextRequest,
) {
    return routeHandler(
        async () => {
            const body =
                await parseBody(
                    request,
                    createConversationSchema,
                );

            const sellerProfile =
                await getSellerProfile();

            const conversation =
                await conversationService.createConversation(
                    body as any,
                    sellerProfile.sellerId,
                );

            return successResponse(
                conversation,
            );
        },
    );
}