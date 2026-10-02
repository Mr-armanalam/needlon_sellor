// ============================================================================
// Needlon
// Messages API
// File: app/api/messages/messages/[messageId]/route.ts
// Description:
// Single-message API.
// Supports retrieving, updating, and deleting a message.
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
    updateMessageSchema,
} from "@/modules/message/validation";

interface MessageRouteContext {
    params: Promise<{
        messageId: string;
    }>;
}

/**
 * ============================================================================
 * GET /api/messages/messages/:messageId
 * ============================================================================
 *
 * Returns a single message.
 */
export async function GET(
    _request: NextRequest,
    context: MessageRouteContext,
) {
    return routeHandler(
        async () => {
            const {
                messageId,
            } = await context.params;

            const message =
                await messageService.getMessage(
                    messageId,
                );

            return successResponse(
                message,
            );
        },
    );
}

/**
 * ============================================================================
 * PATCH /api/messages/messages/:messageId
 * ============================================================================
 *
 * Updates a message owned by the authenticated seller.
 */
export async function PATCH(
    request: NextRequest,
    context: MessageRouteContext,
) {
    return routeHandler(
        async () => {
            const {
                messageId,
            } = await context.params;

            const body =
                await parseBody(
                    request,
                    updateMessageSchema,
                );

            if (
                body.messageId !==
                messageId
            ) {
                throw new Error(
                    "Message identifier does not match the requested resource.",
                );
            }

            const sellerProfile =
                await getSellerProfile();

            const message =
                await messageService.updateMessage(
                    body,
                    sellerProfile.sellerId,
                );

            return successResponse(
                message,
            );
        },
    );
}

/**
 * ============================================================================
 * DELETE /api/messages/messages/:messageId
 * ============================================================================
 *
 * Soft-deletes a message owned by the authenticated seller.
 */
export async function DELETE(
    _request: NextRequest,
    context: MessageRouteContext,
) {
    return routeHandler(
        async () => {
            const {
                messageId,
            } = await context.params;

            const sellerProfile =
                await getSellerProfile();

            await messageService.deleteMessage(
                messageId,
                sellerProfile.sellerId,
            );

            return successResponse(
                {
                    id:
                    messageId,

                    deleted:
                        true,
                },
            );
        },
    );
}