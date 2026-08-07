// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/api/notification.api.ts
// Description:
// Frontend API functions for notification operations.
// ============================================================================

import {
    apiClient,
} from "@/modules/shared/api";

import {
    NotificationDto,
} from "../dto";

/**
 * ============================================================================
 * Notifications
 * ============================================================================
 */

export async function getNotifications() {
    return apiClient.get<
        NotificationDto[]
    >(
        "/api/messages/notifications",
    );
}

/**
 * ============================================================================
 * Mark Notification As Read
 * ============================================================================
 */

export async function markNotificationAsRead(
    notificationId: string,
) {
    return apiClient.patch<
        NotificationDto,
        undefined
    >(
        `/api/messages/notifications/${notificationId}/read`,
        undefined,
    );
}

/**
 * ============================================================================
 * Mark All Notifications As Read
 * ============================================================================
 */

export async function markAllNotificationsAsRead() {
    return apiClient.patch<
        NotificationDto[],
        undefined
    >(
        "/api/messages/notifications/read-all",
        undefined,
    );
}