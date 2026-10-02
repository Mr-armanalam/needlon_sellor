// ============================================================================
// Needlon
// Messages API
// File: app/api/messages/notifications/read-all/route.ts
// Description:
// Marks all notifications belonging to the authenticated seller as read.
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

/**
 * ============================================================================
 * PATCH /api/messages/notifications/read-all
 * ============================================================================
 *
 * Marks all notifications for the authenticated seller as read.
 */
export async function PATCH(
    _request: NextRequest,
) {
    return routeHandler(
        async () => {
            const sellerProfile =
                await getSellerProfile();

            const notifications =
                await notificationService.markAllAsRead(
                    sellerProfile.sellerId,
                );

            return successResponse(
                notifications,
            );
        },
    );
}