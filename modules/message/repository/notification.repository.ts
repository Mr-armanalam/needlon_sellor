// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/repository/notification.repository.ts
// Description:
// Repository responsible for Notification persistence.
// ============================================================================

import {
    and,
    count,
    desc,
    eq,
    inArray,
    isNull,
} from "drizzle-orm";

import { db } from "@/db";

import {
    notificationsTable as notifications,
} from "@/db/schema/messages";

import {
    NotificationDto,
} from "../dto";

export class NotificationRepository {
    /**
     * =========================================================================
     * Create
     * =========================================================================
     */

    async create(
        values: typeof notifications.$inferInsert,
    ) {
        const [notification] =
            await db
                .insert(notifications)
                .values(values)
                .returning();

        return notification;
    }

    /**
     * =========================================================================
     * Bulk Create
     * =========================================================================
     */

    async createMany(
        values: typeof notifications.$inferInsert[],
    ) {
        return db
            .insert(notifications)
            .values(values)
            .returning();
    }

    /**
     * =========================================================================
     * Find By ID
     * =========================================================================
     */

    async findById(
        notificationId: string,
    ) {
        const [notification] =
            await db
                .select()
                .from(notifications)
                .where(
                    eq(
                        notifications.id,
                        notificationId,
                    ),
                )
                .limit(1);

        return notification ?? null;
    }

    /**
     * =========================================================================
     * Find Many
     * =========================================================================
     */

    async findManyByIds(
        notificationIds: string[],
    ) {
        if (
            notificationIds.length ===
            0
        ) {
            return [];
        }

        return db
            .select()
            .from(notifications)
            .where(
                inArray(
                    notifications.id,
                    notificationIds,
                ),
            );
    }

    /**
     * =========================================================================
     * Find Seller Notifications
     * =========================================================================
     */

    async findSellerNotifications(
        sellerId: string,
    ) {
        return db
            .select()
            .from(notifications)
            .where(
                eq(
                    notifications.recipientSellerId,
                    sellerId,
                ),
            )
            .orderBy(
                desc(
                    notifications.createdAt,
                ),
            );
    }

    /**
     * =========================================================================
     * Mark As Read
     * =========================================================================
     */

    async markAsRead(
        notificationId: string,
    ) {
        const [notification] =
            await db
                .update(notifications)
                .set({
                    isRead: true,
                    readAt: new Date(),
                })
                .where(
                    eq(
                        notifications.id,
                        notificationId,
                    ),
                )
                .returning();

        return notification ?? null;
    }

    /**
     * =========================================================================
     * Mark All As Read
     * =========================================================================
     */

    async markAllAsRead(
        sellerId: string,
    ) {
        return db
            .update(notifications)
            .set({
                isRead: true,
                readAt: new Date(),
            })
            .where(
                and(
                    eq(
                        notifications.recipientSellerId,
                        sellerId,
                    ),
                    eq(
                        notifications.isRead,
                        false,
                    ),
                ),
            )
            .returning();
    }

    /**
     * =========================================================================
     * Update
     * =========================================================================
     */

    async update(
        notificationId: string,
        values: Partial<typeof notifications.$inferInsert>,
    ) {
        const [notification] =
            await db
                .update(notifications)
                .set(values)
                .where(
                    eq(
                        notifications.id,
                        notificationId,
                    ),
                )
                .returning();

        return notification ?? null;
    }

    /**
     * =========================================================================
     * Soft Delete
     * =========================================================================
     */

    async softDelete(
        notificationId: string,
    ) {
        await db
            .delete(notifications)
            .where(
                eq(
                    notifications.id,
                    notificationId,
                ),
            );
    }

    /**
     * =========================================================================
     * Exists
     * =========================================================================
     */

    async exists(
        notificationId: string,
    ) {
        const [result] =
            await db
                .select({
                    count:
                        count(),
                })
                .from(notifications)
                .where(
                    eq(
                        notifications.id,
                        notificationId,
                    ),
                );

        return result.count > 0;
    }

    /**
     * =========================================================================
     * Count Unread
     * =========================================================================
     */

    async countUnread(
        sellerId: string,
    ) {
        const [result] =
            await db
                .select({
                    count:
                        count(),
                })
                .from(notifications)
                .where(
                    and(
                        eq(
                            notifications.recipientSellerId,
                            sellerId,
                        ),
                        eq(
                            notifications.isRead,
                            false,
                        ),
                    ),
                );

        return result.count;
    }
}

export const notificationRepository =
    new NotificationRepository();