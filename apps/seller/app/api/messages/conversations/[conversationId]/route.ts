// ============================================================================
// Needlon
// Messages API
// File: app/api/messages/conversations/[conversationId]/route.ts
// Description:
// Single-conversation API.
// Supports retrieving, updating, and deleting a conversation.
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
    updateConversationSchema,
} from "@/modules/message/validation";

interface ConversationRouteContext {
    params: Promise<{
        conversationId: string;
    }>;
}

/**
 * ============================================================================
 * GET /api/messages/conversations/:conversationId
 * ============================================================================
 *
 * Returns a single conversation for the authenticated seller.
 */
export async function GET(
    _request: NextRequest,
    context: ConversationRouteContext,
) {
    return routeHandler(
        async () => {
            const {
                conversationId,
            } = await context.params;

            const sellerProfile =
                await getSellerProfile();

            const conversation =
                await conversationService.getConversation(
                    conversationId,
                    sellerProfile.sellerId,
                );

            return successResponse(
                conversation,
            );
        },
    );
}

/**
 * ============================================================================
 * PATCH /api/messages/conversations/:conversationId
 * ============================================================================
 *
 * Updates an existing conversation.
 */
export async function PATCH(
    request: NextRequest,
    context: ConversationRouteContext,
) {
    return routeHandler(
        async () => {
            const {
                conversationId,
            } = await context.params;

            const body =
                await parseBody(
                    request,
                    updateConversationSchema,
                );

            const conversation =
                await conversationService.updateConversation(
                    conversationId,
                    body,
                );

            return successResponse(
                conversation,
            );
        },
    );
}

/**
 * ============================================================================
 * DELETE /api/messages/conversations/:conversationId
 * ============================================================================
 *
 * Soft-deletes an existing conversation.
 */
export async function DELETE(
    _request: NextRequest,
    context: ConversationRouteContext,
) {
    return routeHandler(
        async () => {
            const {
                conversationId,
            } = await context.params;

            await conversationService.deleteConversation(
                conversationId,
            );

            return successResponse(
                {
                    id:
                    conversationId,

                    deleted:
                        true,
                },
            );
        },
    );
}