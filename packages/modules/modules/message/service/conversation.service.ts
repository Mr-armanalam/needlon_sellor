// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/service/conversation.service.ts
// Description:
// Business logic for Conversation management.
// ============================================================================

import { db } from "@/db";
import { seller } from "@/db/schema/seller";
import { sellerProfiles } from "@/db/schema/seller/seller-profile";
import {
    conversationMembersTable,
    messagesTable,
} from "@/db/schema/messages";
import { and, eq, inArray, isNull } from "drizzle-orm";

import {
    conversationRepository,
} from "../repository";

import {
    toConversationDto,
} from "../mapper";

import {
    CreateConversationDto,
    UpdateConversationDto,
} from "../dto";

import {
    ConversationNotFoundError,
} from "../errors";

export class ConversationService {
    /**
     * =========================================================================
     * Private Helpers
     * =========================================================================
     */

    private async hydrateConversations(
        rawConversations: any[],
        currentSellerId: string,
    ) {
        if (rawConversations.length === 0) {
            return [];
        }

        const conversationIds = rawConversations.map((c) => c.id);

        // 1. Fetch all conversation members (joined with seller and profiles)
        const allMembers = await db
            .select({
                conversationId: conversationMembersTable.conversationId,
                sellerId: conversationMembersTable.sellerId,
                role: conversationMembersTable.role,
                unreadCount: conversationMembersTable.unreadCount,
                isPinned: conversationMembersTable.isPinned,
                isMuted: conversationMembersTable.isMuted,
                isArchived: conversationMembersTable.isArchived,
                joinedAt: conversationMembersTable.joinedAt,
                name: seller.name,
                displayName: sellerProfiles.displayName,
                avatarUrl: sellerProfiles.profileImageUrl,
            })
            .from(conversationMembersTable)
            .leftJoin(seller, eq(conversationMembersTable.sellerId, seller.id))
            .leftJoin(sellerProfiles, eq(seller.id, sellerProfiles.sellerId))
            .where(
                and(
                    inArray(conversationMembersTable.conversationId, conversationIds),
                    isNull(conversationMembersTable.leftAt),
                ),
            );

        // Group members by conversation ID
        const membersMap = new Map<string, any[]>();
        const memberCounts = new Map<string, number>();
        const sellerMembershipMap = new Map<string, any>();

        for (const m of allMembers) {
            const list = membersMap.get(m.conversationId) || [];
            list.push({
                sellerId: m.sellerId,
                displayName: m.displayName || m.name || "User",
                avatarUrl: m.avatarUrl || null,
                role: m.role,
                isOnline: false,
                lastSeenAt: m.joinedAt,
            });
            membersMap.set(m.conversationId, list);

            memberCounts.set(
                m.conversationId,
                (memberCounts.get(m.conversationId) || 0) + 1,
            );

            if (m.sellerId === currentSellerId) {
                sellerMembershipMap.set(m.conversationId, m);
            }
        }

        // 2. Fetch last messages (if conversations contain lastMessageId)
        const lastMessageIds = rawConversations
            .map((c) => c.lastMessageId)
            .filter(Boolean) as string[];

        let lastMessagesMap = new Map<string, any>();
        if (lastMessageIds.length > 0) {
            const lastMessages = await db
                .select({
                    id: messagesTable.id,
                    conversationId: messagesTable.conversationId,
                    senderId: messagesTable.senderId,
                    body: messagesTable.text,
                    messageType: messagesTable.type,
                    createdAt: messagesTable.createdAt,
                    deletedAt: messagesTable.deletedAt,
                    senderName: seller.name,
                    senderDisplayName: sellerProfiles.displayName,
                })
                .from(messagesTable)
                .leftJoin(seller, eq(messagesTable.senderId, seller.id))
                .leftJoin(sellerProfiles, eq(seller.id, sellerProfiles.sellerId))
                .where(inArray(messagesTable.id, lastMessageIds));

            lastMessagesMap = new Map(
                lastMessages.map((m) => [
                    m.id,
                    {
                        id: m.id,
                        senderId: m.senderId,
                        senderName: m.senderDisplayName || m.senderName || "User",
                        body: m.body,
                        messageType: m.messageType,
                        createdAt: m.createdAt,
                        isDeleted: m.deletedAt !== null,
                    },
                ]),
            );
        }

        return rawConversations.map((conv) => {
            const members = membersMap.get(conv.id) || [];
            const memberCount = memberCounts.get(conv.id) || 0;
            const membership = sellerMembershipMap.get(conv.id) || {};
            const lastMessage = conv.lastMessageId
                ? lastMessagesMap.get(conv.lastMessageId)
                : null;

            return toConversationDto({
                conversation: {
                    id: conv.id,
                    type: conv.type,
                    status: conv.status,
                    title: conv.title,
                    avatarUrl: conv.avatarUrl || null,
                    description: conv.description || null,
                    createdAt: conv.createdAt,
                    updatedAt: conv.updatedAt,
                },
                currentSellerId,
                memberCount,
                unreadCount: membership.unreadCount || 0,
                isPinned: membership.isPinned || false,
                isMuted: membership.isMuted || false,
                isArchived: membership.isArchived || false,
                isActive: conv.status === "ACTIVE",
                members,
                lastMessage,
            });
        });
    }

    /**
     * =========================================================================
     * Create Conversation
     * =========================================================================
     */

    async createConversation(
        input: CreateConversationDto,
        currentSellerId: string,
    ) {
        const now = new Date();

        const conversation = await conversationRepository.create({
            type: input.type,
            title: input.title,
            sellerId: currentSellerId,
            createdAt: now,
            updatedAt: now,
        });

        // Add creator as member
        await db.insert(conversationMembersTable).values({
            conversationId: conversation.id,
            sellerId: currentSellerId,
            role: "SELLER",
            status: "ACTIVE",
            unreadCount: 0,
            isPinned: false,
            isMuted: false,
            isArchived: false,
            joinedAt: now,
            createdAt: now,
            updatedAt: now,
        });

        const [hydrated] = await this.hydrateConversations(
            [conversation],
            currentSellerId,
        );
        return hydrated;
    }

    /**
     * =========================================================================
     * Get Conversation
     * =========================================================================
     */

    async getConversation(
        conversationId: string,
        currentSellerId: string,
    ) {
        const conversation = await conversationRepository.findById(
            conversationId,
        );

        if (!conversation) {
            throw new ConversationNotFoundError(
                conversationId,
            );
        }

        const [hydrated] = await this.hydrateConversations(
            [conversation],
            currentSellerId,
        );
        return hydrated;
    }

    /**
     * =========================================================================
     * List Seller Conversations
     * =========================================================================
     */

    async getSellerConversations(
        sellerId: string,
    ) {
        const conversations =
            await conversationRepository.findSellerConversations(
                sellerId,
            );

        const rawConvs = conversations.map((c) => c.conversation);
        return this.hydrateConversations(rawConvs, sellerId);
    }

    /**
     * =========================================================================
     * Search Conversations
     * =========================================================================
     */

    async searchConversations(
        sellerId: string,
        query: string,
    ) {
        const conversations =
            await conversationRepository.search(
                sellerId,
                query,
            );

        const rawConvs = conversations.map((c) => c.conversation);
        return this.hydrateConversations(rawConvs, sellerId);
    }

    /**
     * =========================================================================
     * Update Conversation
     * =========================================================================
     */

    async updateConversation(
        conversationId: string,
        input: UpdateConversationDto,
    ) {
        const exists = await conversationRepository.findById(
            conversationId,
        );

        if (!exists) {
            throw new ConversationNotFoundError(
                conversationId,
            );
        }

        const conversation = await conversationRepository.update(
            conversationId,
            {
                ...input,
                updatedAt: new Date(),
            },
        );

        if (!conversation) {
            throw new ConversationNotFoundError(
                conversationId,
            );
        }

        return conversation;
    }

    /**
     * =========================================================================
     * Delete Conversation
     * =========================================================================
     */

    async deleteConversation(
        conversationId: string,
    ) {
        const exists = await conversationRepository.exists(
            conversationId,
        );

        if (!exists) {
            throw new ConversationNotFoundError(
                conversationId,
            );
        }

        await conversationRepository.softDelete(
            conversationId,
        );
    }

    /**
     * =========================================================================
     * Count Conversations
     * =========================================================================
     */

    async countSellerConversations(
        sellerId: string,
    ) {
        return conversationRepository.countSellerConversations(
            sellerId,
        );
    }
}

export const conversationService = new ConversationService();