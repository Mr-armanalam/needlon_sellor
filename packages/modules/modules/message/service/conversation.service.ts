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
import { usersTable } from "@/db/schema/users";
import { orders } from "@/db/schema/orders/table";
import { and, eq, inArray, isNull, sql } from "drizzle-orm";

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

        // Fetch buyer and order info for order-linked conversations
        const buyerIds = Array.from(
            new Set(
                rawConversations
                    .map((c) => c.buyerId)
                    .filter(Boolean),
            ),
        ) as string[];

        let buyersMap = new Map<string, { id: string; name: string | null; email: string | null }>();
        if (buyerIds.length > 0) {
            const buyers = await db
                .select({
                    id: usersTable.id,
                    name: usersTable.name,
                    email: usersTable.email,
                })
                .from(usersTable)
                .where(inArray(usersTable.id, buyerIds));
            buyersMap = new Map(buyers.map((b) => [b.id, b]));
        }

        const orderIds = Array.from(
            new Set(
                rawConversations
                    .map((c) => c.orderId)
                    .filter(Boolean),
            ),
        ) as string[];

        let ordersMap = new Map<string, { id: string; orderNumber: string }>();
        if (orderIds.length > 0) {
            const orderRows = await db
                .select({
                    id: orders.id,
                    orderNumber: orders.orderNumber,
                })
                .from(orders)
                .where(inArray(orders.id, orderIds));
            ordersMap = new Map(orderRows.map((o) => [o.id, o]));
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
                    senderType: messagesTable.senderType,
                    body: sql<string>`COALESCE(${messagesTable.text}, ${messagesTable.content})`,
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
                lastMessages.map((m) => {
                    let displayName = m.senderDisplayName || m.senderName;
                    if (!displayName && m.senderId && buyersMap.has(m.senderId)) {
                        displayName = buyersMap.get(m.senderId)?.name || buyersMap.get(m.senderId)?.email?.split("@")[0] || "Customer";
                    }
                    return [
                        m.id,
                        {
                            id: m.id,
                            senderId: m.senderId,
                            senderName: displayName || (m.senderType === "BUYER" ? "Customer" : "User"),
                            body: m.body,
                            messageType: m.messageType,
                            createdAt: m.createdAt,
                            isDeleted: m.deletedAt !== null,
                        },
                    ];
                }),
            );
        }

        return rawConversations.map((conv) => {
            const members = [...(membersMap.get(conv.id) || [])];
            const membership = sellerMembershipMap.get(conv.id) || {};
            const buyerUser = conv.buyerId ? buyersMap.get(conv.buyerId) : null;
            const buyerDisplayName = buyerUser?.name || buyerUser?.email?.split("@")[0] || "Customer";

            // If buyer is not in members, add buyer member
            if (conv.buyerId && !members.some((m) => m.sellerId === conv.buyerId)) {
                members.push({
                    sellerId: conv.buyerId,
                    displayName: buyerDisplayName,
                    avatarUrl: null,
                    role: "BUYER",
                    isOnline: false,
                    lastSeenAt: null,
                });
            }

            // If seller is not in members, add seller member
            if (!members.some((m) => m.sellerId === currentSellerId)) {
                members.push({
                    sellerId: currentSellerId,
                    displayName: "You",
                    avatarUrl: null,
                    role: "SELLER",
                    isOnline: true,
                    lastSeenAt: new Date(),
                });
            }

            const orderInfo = conv.orderId ? ordersMap.get(conv.orderId) : null;
            const derivedTitle = conv.title || (orderInfo ? `${buyerDisplayName} (Order #${orderInfo.orderNumber})` : buyerDisplayName);

            const lastMessage = conv.lastMessageId
                ? (lastMessagesMap.get(conv.lastMessageId) || null)
                : (conv.lastMessagePreview
                    ? {
                        id: conv.lastMessageId || "msg-fallback",
                        senderId: conv.buyerId || "",
                        senderName: buyerDisplayName,
                        body: conv.lastMessagePreview,
                        messageType: conv.lastMessageType || "TEXT",
                        createdAt: conv.lastMessageAt || conv.updatedAt,
                        isDeleted: false,
                    }
                    : null);

            return toConversationDto({
                conversation: {
                    id: conv.id,
                    type: (conv.type || conv.conversationType || "ORDER") as any,
                    status: (conv.status || "ACTIVE") as any,
                    title: derivedTitle,
                    avatarUrl: conv.avatarUrl || null,
                    description: conv.description || null,
                    createdAt: conv.createdAt,
                    updatedAt: conv.updatedAt,
                },
                currentSellerId,
                memberCount: members.length,
                unreadCount: membership.unreadCount || conv.unreadCount || 0,
                isPinned: membership.isPinned || conv.isPinned || false,
                isMuted: membership.isMuted || conv.isMuted || false,
                isArchived: membership.isArchived || conv.isArchived || false,
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