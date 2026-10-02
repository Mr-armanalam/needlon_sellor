// ============================================================================
// Needlon
// Messages API
// File: app/api/messages/conversations/[conversationId]/messages/route.ts
// Description:
// Conversation message collection API.
// Supports retrieving messages for a conversation and sending a new message.
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
    messageService,
} from "@/modules/message/service";

import {
    sendMessageSchema,
} from "@/modules/message/validation";

interface ConversationMessagesRouteContext {
    params: Promise<{
        conversationId: string;
    }>;
}

/**
 * ============================================================================
 * GET /api/messages/conversations/:conversationId/messages
 * ============================================================================
 *
 * Returns messages belonging to the specified conversation.
 */
export async function GET(
    _request: NextRequest,
    context: ConversationMessagesRouteContext,
) {
    return routeHandler(
        async () => {
            const {
                conversationId,
            } = await context.params;

            const sellerProfile =
                await getSellerProfile();

            // Resolve the authenticated seller before executing
            // the application workflow.
            const conversation =
                await messageService.getConversationMessages(
                    conversationId,
                );

            return successResponse(
                conversation,
            );
        },
    );
}

/**
 * ============================================================================
 * POST /api/messages/conversations/:conversationId/messages
 * ============================================================================
 *
 * Sends a new message to the specified conversation.
 */
export async function POST(
    request: NextRequest,
    context: ConversationMessagesRouteContext,
) {
    return routeHandler(
        async () => {
            const {
                conversationId,
            } = await context.params;

            const body =
                await parseBody(
                    request,
                    sendMessageSchema,
                );

            if (
                body.conversationId !==
                conversationId
            ) {
                throw new Error(
                    "Message conversation does not match the requested conversation.",
                );
            }

            const sellerProfile =
                await getSellerProfile();

            const message =
                await messageService.sendMessage(
                    body as any,
                    sellerProfile.sellerId,
                );

            return successResponse(
                message,
            );
        },
    );
}