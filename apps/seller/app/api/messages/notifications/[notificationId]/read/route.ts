// ============================================================================
// Needlon
// Messages API
// File: app/api/messages/notifications/[notificationId]/read/route.ts
// Description:
// Marks a notification as read for the authenticated seller.
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
    notificationService,
} from "@/modules/message/service";

interface NotificationReadRouteContext {
    params: Promise<{
        notificationId: string;
    }>;
}

/**
 * ============================================================================
 * PATCH /api/messages/notifications/:notificationId/read
 * ============================================================================
 *
 * Marks the specified notification as read.
 */
export async function PATCH(
    _request: NextRequest,
    context: NotificationReadRouteContext,
) {
    return routeHandler(
        async () => {
            const {
                notificationId,
            } = await context.params;

            const sellerProfile =
                await getSellerProfile();

            const notification =
                await notificationService.markAsRead(
                    notificationId,
                    sellerProfile.sellerId,
                );

            return successResponse(
                notification,
            );
        },
    );
}