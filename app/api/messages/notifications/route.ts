// ============================================================================
// Needlon
// Messages API
// File: app/api/messages/notifications/route.ts
// Description:
// Notification collection API.
// Returns notifications belonging to the authenticated seller.
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
 * GET /api/messages/notifications
 * ============================================================================
 *
 * Returns notifications for the authenticated seller.
 *
 * Authentication:
 * - Seller identity is resolved through the existing seller-profile service.
 *
 * Business logic:
 * - Notification retrieval is delegated to NotificationService.
 *
 * Response:
 * - NotificationDto[]
 */
export async function GET(
    _request: NextRequest,
) {
    return routeHandler(
        async () => {
            const sellerProfile =
                await getSellerProfile();

            const notifications =
                await notificationService.getSellerNotifications(
                    sellerProfile.sellerId,
                );

            return successResponse(
                notifications,
            );
        },
    );
}