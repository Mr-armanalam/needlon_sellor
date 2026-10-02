// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/repository/message.repository.ts
// Description:
// Repository responsible for Message persistence.
// ============================================================================

import {
    and,
    asc,
    count,
    desc,
    eq,
    inArray,
    isNull,
} from "drizzle-orm";

import { db } from "@/db";

import {
    messagesTable as messages,
} from "@/db/schema/messages";

import {
    SendMessageDto,
    UpdateMessageDto,
} from "../dto";

export class MessageRepository {
    /**
     * =========================================================================
     * Create
     * =========================================================================
     */

    async create(
        values: typeof messages.$inferInsert,
    ) {
        const [message] =
            await db
                .insert(messages)
                .values(values)
                .returning();

        return message;
    }

    /**
     * =========================================================================
     * Find by ID
     * =========================================================================
     */

    async findById(
        messageId: string,
    ) {
        const [message] =
            await db
                .select()
                .from(messages)
                .where(
                    eq(
                        messages.id,
                        messageId,
                    ),
                )
                .limit(1);

        return message ?? null;
    }

    /**
     * =========================================================================
     * Find Many
     * =========================================================================
     */

    async findManyByIds(
        messageIds: string[],
    ) {
        if (
            messageIds.length ===
            0
        ) {
            return [];
        }

        return db
            .select()
            .from(messages)
            .where(
                inArray(
                    messages.id,
                    messageIds,
                ),
            );
    }

    /**
     * =========================================================================
     * Find Conversation Messages
     * =========================================================================
     */

    async findConversationMessages(
        conversationId: string,
    ) {
        return db
            .select()
            .from(messages)
            .where(
                and(
                    eq(
                        messages.conversationId,
                        conversationId,
                    ),
                    isNull(
                        messages.deletedAt,
                    ),
                ),
            )
            .orderBy(
                asc(
                    messages.createdAt,
                ),
            );
    }

    /**
     * =========================================================================
     * Find Latest Message
     * =========================================================================
     */

    async findLatestMessage(
        conversationId: string,
    ) {
        const [message] =
            await db
                .select()
                .from(messages)
                .where(
                    and(
                        eq(
                            messages.conversationId,
                            conversationId,
                        ),
                        isNull(
                            messages.deletedAt,
                        ),
                    ),
                )
                .orderBy(
                    desc(
                        messages.createdAt,
                    ),
                )
                .limit(1);

        return message ?? null;
    }

    /**
     * =========================================================================
     * Update
     * =========================================================================
     */

    async update(
        messageId: string,
        values: Partial<typeof messages.$inferInsert>,
    ) {
        const [message] =
            await db
                .update(messages)
                .set(values)
                .where(
                    eq(
                        messages.id,
                        messageId,
                    ),
                )
                .returning();

        return message ?? null;
    }

    /**
     * =========================================================================
     * Soft Delete
     * =========================================================================
     */

    async softDelete(
        messageId: string,
    ) {
        await db
            .update(messages)
            .set({
                deletedAt:
                    new Date(),
            })
            .where(
                eq(
                    messages.id,
                    messageId,
                ),
            );
    }

    /**
     * =========================================================================
     * Exists
     * =========================================================================
     */

    async exists(
        messageId: string,
    ) {
        const [result] =
            await db
                .select({
                    count:
                        count(),
                })
                .from(messages)
                .where(
                    eq(
                        messages.id,
                        messageId,
                    ),
                );

        return result.count > 0;
    }

    /**
     * =========================================================================
     * Count Conversation Messages
     * =========================================================================
     */

    async countConversationMessages(
        conversationId: string,
    ) {
        const [result] =
            await db
                .select({
                    count:
                        count(),
                })
                .from(messages)
                .where(
                    and(
                        eq(
                            messages.conversationId,
                            conversationId,
                        ),
                        isNull(
                            messages.deletedAt,
                        ),
                    ),
                );

        return result.count;
    }
}

export const messageRepository =
    new MessageRepository();