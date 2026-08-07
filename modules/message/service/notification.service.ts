// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/service/notification.service.ts
// Description:
// Business logic for Notification management.
// ============================================================================

import {
    toNotificationDto,
} from "../mapper";

import {
    notificationRepository,
} from "../repository";

import {
    NotificationNotFoundError,
} from "../errors";

/**
 * ============================================================================
 * Notification Service
 * ============================================================================
 */

export class NotificationService {
    /**
     * =========================================================================
     * Create Notification
     * =========================================================================
     */

    async createNotification(
        values: Parameters<
            typeof notificationRepository.create
        >[0],
    ) {
        const notification =
            await notificationRepository.create(
                values,
            );

        return toNotificationDto(
            notification,
        );
    }

    /**
     * =========================================================================
     * Create Notifications
     * =========================================================================
     */

    async createNotifications(
        values: Parameters<
            typeof notificationRepository.createMany
        >[0],
    ) {
        const notifications =
            await notificationRepository.createMany(
                values,
            );

        return notifications.map(
            toNotificationDto,
        );
    }

    /**
     * =========================================================================
     * Get Notification
     * =========================================================================
     */

    async getNotification(
        notificationId: string,
    ) {
        const notification =
            await notificationRepository.findById(
                notificationId,
            );

        if (!notification) {
            throw new NotificationNotFoundError(
                notificationId,
            );
        }

        return toNotificationDto(
            notification,
        );
    }

    /**
     * =========================================================================
     * Get Seller Notifications
     * =========================================================================
     */

    async getSellerNotifications(
        sellerId: string,
    ) {
        const notifications =
            await notificationRepository.findSellerNotifications(
                sellerId,
            );

        return notifications.map(
            toNotificationDto,
        );
    }

    /**
     * =========================================================================
     * Mark Notification As Read
     * =========================================================================
     */

    async markAsRead(
        notificationId: string,
        sellerId: string,
    ) {
        const notification =
            await notificationRepository.findById(
                notificationId,
            );

        if (!notification) {
            throw new NotificationNotFoundError(
                notificationId,
            );
        }

        if (
            notification.recipientSellerId !==
            sellerId
        ) {
            throw new Error(
                "Notification does not belong to the current seller.",
            );
        }

        const updatedNotification =
            await notificationRepository.markAsRead(
                notificationId,
            );

        if (!updatedNotification) {
            throw new NotificationNotFoundError(
                notificationId,
            );
        }

        return toNotificationDto(
            updatedNotification,
        );
    }

    /**
     * =========================================================================
     * Mark All Notifications As Read
     * =========================================================================
     */

    async markAllAsRead(
        sellerId: string,
    ) {
        const notifications =
            await notificationRepository.markAllAsRead(
                sellerId,
            );

        return notifications.map(
            toNotificationDto,
        );
    }

    /**
     * =========================================================================
     * Count Unread Notifications
     * =========================================================================
     */

    async countUnread(
        sellerId: string,
    ) {
        return notificationRepository.countUnread(
            sellerId,
        );
    }

    /**
     * =========================================================================
     * Update Notification
     * =========================================================================
     */

    async updateNotification(
        notificationId: string,
        sellerId: string,
        values: Parameters<
            typeof notificationRepository.update
        >[1],
    ) {
        const existingNotification =
            await notificationRepository.findById(
                notificationId,
            );

        if (!existingNotification) {
            throw new NotificationNotFoundError(
                notificationId,
            );
        }

        if (
            existingNotification.recipientSellerId !==
            sellerId
        ) {
            throw new Error(
                "Notification does not belong to the current seller.",
            );
        }

        const notification =
            await notificationRepository.update(
                notificationId,
                values,
            );

        if (!notification) {
            throw new NotificationNotFoundError(
                notificationId,
            );
        }

        return toNotificationDto(
            notification,
        );
    }

    /**
     * =========================================================================
     * Delete Notification
     * =========================================================================
     */

    async deleteNotification(
        notificationId: string,
        sellerId: string,
    ) {
        const notification =
            await notificationRepository.findById(
                notificationId,
            );

        if (!notification) {
            throw new NotificationNotFoundError(
                notificationId,
            );
        }

        if (
            notification.recipientSellerId !==
            sellerId
        ) {
            throw new Error(
                "Notification does not belong to the current seller.",
            );
        }

        await notificationRepository.softDelete(
            notificationId,
        );
    }
}

/**
 * ============================================================================
 * Singleton Service
 * ============================================================================
 */

export const notificationService =
    new NotificationService();