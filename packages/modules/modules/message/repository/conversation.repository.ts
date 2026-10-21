// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/repository/conversation.repository.ts
// Description:
// Repository responsible for Conversation persistence.
// ============================================================================

import {
    and,
    asc,
    count,
    desc,
    eq,
    ilike,
    inArray,
    isNull,
    ne,
    or,
    sql,
} from "drizzle-orm";

import { db } from "@/db";

import {
    conversationMembersTable as conversationMembers,
    conversationsTable as conversations,
} from "@/db/schema/messages";

import { seller } from "@/db/schema/seller";
import { sellerProfiles } from "@/db/schema/seller/seller-profile";
import { alias } from "drizzle-orm/pg-core";

import {
    CreateConversationDto,
    UpdateConversationDto,
} from "../dto";

export class ConversationRepository {
    /**
     * =========================================================================
     * Create
     * =========================================================================
     */

    async create(
        values: typeof conversations.$inferInsert,
    ) {
        const [conversation] =
            await db
                .insert(conversations)
                .values(values)
                .returning();

        return conversation;
    }

    /**
     * =========================================================================
     * Find by ID
     * =========================================================================
     */

    async findById(
        conversationId: string,
    ) {
        const [conversation] =
            await db
                .select()
                .from(conversations)
                .where(
                    eq(
                        conversations.id,
                        conversationId,
                    ),
                )
                .limit(1);

        return conversation ?? null;
    }

    /**
     * =========================================================================
     * Find by IDs
     * =========================================================================
     */

    async findManyByIds(
        conversationIds: string[],
    ) {
        if (
            conversationIds.length ===
            0
        ) {
            return [];
        }

        return db
            .select()
            .from(conversations)
            .where(
                inArray(
                    conversations.id,
                    conversationIds,
                ),
            );
    }

    /**
     * =========================================================================
     * Find Seller Conversations
     * =========================================================================
     */

    async findSellerConversations(
        sellerId: string,
    ) {
        return db
            .selectDistinct({
                conversation:
                conversations,
            })
            .from(
                conversations,
            )
            .leftJoin(
                conversationMembers,
                eq(
                    conversationMembers.conversationId,
                    conversations.id,
                ),
            )
            .where(
                and(
                    or(
                        eq(
                            conversations.sellerId,
                            sellerId,
                        ),
                        and(
                            eq(
                                conversationMembers.sellerId,
                                sellerId,
                            ),
                            isNull(
                                conversationMembers.leftAt,
                            ),
                        ),
                    ),
                    isNull(
                        conversations.deletedAt,
                    ),
                ),
            )
            .orderBy(
                desc(
                    conversations.updatedAt,
                ),
            );
    }

    /**
     * =========================================================================
     * Search
     * =========================================================================
     */

    async search(
        sellerId: string,
        query: string,
    ) {
        const otherMembers = alias(conversationMembers, "other_members");

        return db
            .selectDistinct({
                conversation: conversations,
            })
            .from(conversations)
            .leftJoin(
                conversationMembers,
                eq(conversations.id, conversationMembers.conversationId),
            )
            .leftJoin(
                otherMembers,
                and(
                    eq(conversations.id, otherMembers.conversationId),
                    ne(otherMembers.sellerId, sellerId)
                )
            )
            .leftJoin(
                seller,
                eq(otherMembers.sellerId, seller.id)
            )
            .leftJoin(
                sellerProfiles,
                eq(seller.id, sellerProfiles.sellerId)
            )
            .where(
                and(
                    or(
                        eq(conversations.sellerId, sellerId),
                        and(
                            eq(conversationMembers.sellerId, sellerId),
                            isNull(conversationMembers.leftAt),
                        )
                    ),
                    isNull(conversations.deletedAt),
                    or(
                        ilike(conversations.title, `%${query}%`),
                        ilike(seller.name, `%${query}%`),
                        ilike(sellerProfiles.displayName, `%${query}%`)
                    )
                )
            )
            .orderBy(
                asc(conversations.title),
            );
    }

    /**
     * =========================================================================
     * Update
     * =========================================================================
     */

    async update(
        conversationId: string,
        values: Partial<typeof conversations.$inferInsert>,
    ) {
        const [conversation] =
            await db
                .update(conversations)
                .set(values)
                .where(
                    eq(
                        conversations.id,
                        conversationId,
                    ),
                )
                .returning();

        return conversation ?? null;
    }

    /**
     * =========================================================================
     * Soft Delete
     * =========================================================================
     */

    async softDelete(
        conversationId: string,
    ) {
        await db
            .update(conversations)
            .set({
                deletedAt:
                    new Date(),
            })
            .where(
                eq(
                    conversations.id,
                    conversationId,
                ),
            );
    }

    /**
     * =========================================================================
     * Exists
     * =========================================================================
     */

    async exists(
        conversationId: string,
    ) {
        const [result] =
            await db
                .select({
                    count:
                        count(),
                })
                .from(conversations)
                .where(
                    eq(
                        conversations.id,
                        conversationId,
                    ),
                );

        return result.count > 0;
    }

    /**
     * =========================================================================
     * Count
     * =========================================================================
     */

    async countSellerConversations(
        sellerId: string,
    ) {
        const [result] =
            await db
                .select({
                    count:
                        sql<number>`cast(count(DISTINCT ${conversations.id}) as int)`,
                })
                .from(
                    conversations,
                )
                .leftJoin(
                    conversationMembers,
                    eq(
                        conversationMembers.conversationId,
                        conversations.id,
                    ),
                )
                .where(
                    and(
                        or(
                            eq(
                                conversations.sellerId,
                                sellerId,
                            ),
                            and(
                                eq(
                                    conversationMembers.sellerId,
                                    sellerId,
                                ),
                                isNull(
                                    conversationMembers.leftAt,
                                ),
                            ),
                        ),
                        isNull(
                            conversations.deletedAt,
                        ),
                    ),
                );

        return result?.count ?? 0;
    }
}

export const conversationRepository =
    new ConversationRepository();