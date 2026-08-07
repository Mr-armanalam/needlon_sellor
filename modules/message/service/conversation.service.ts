// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/service/conversation.service.ts
// Description:
// Business logic for Conversation management.
// ============================================================================

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
     * Create Conversation
     * =========================================================================
     */

    async createConversation(
        input: CreateConversationDto,
        currentSellerId: string,
    ) {
        const now =
            new Date();

        const conversation =
            await conversationRepository.create(
                {
                    type:
                    input.type,

                    title:
                    input.title,

                    sellerId:
                    currentSellerId,

                    createdAt:
                    now,

                    updatedAt:
                    now,
                },
            );

        return toConversationDto({
            conversation,

            currentSellerId,

            memberCount: 1,

            unreadCount: 0,

            isPinned: false,

            isMuted: false,

            isArchived: false,

            isActive: true,

            members: [],

            lastMessage: null,
        });
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
        const conversation =
            await conversationRepository.findById(
                conversationId,
            );

        if (!conversation) {
            throw new ConversationNotFoundError(
                conversationId,
            );
        }

        return toConversationDto({
            conversation,

            currentSellerId,

            memberCount: 0,

            unreadCount: 0,

            isPinned: false,

            isMuted: false,

            isArchived: false,

            isActive: true,

            members: [],

            lastMessage: null,
        });
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

        return conversations.map(
            ({
                 conversation,
             }) =>
                toConversationDto({
                    conversation,

                    currentSellerId:
                    sellerId,

                    memberCount: 0,

                    unreadCount: 0,

                    isPinned: false,

                    isMuted: false,

                    isArchived: false,

                    isActive: true,

                    members: [],

                    lastMessage:
                        null,
                }),
        );
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

        return conversations.map(
            ({
                 conversation,
             }) =>
                toConversationDto({
                    conversation,

                    currentSellerId:
                    sellerId,

                    memberCount: 0,

                    unreadCount: 0,

                    isPinned: false,

                    isMuted: false,

                    isArchived: false,

                    isActive: true,

                    members: [],

                    lastMessage:
                        null,
                }),
        );
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
        const exists =
            await conversationRepository.findById(
                conversationId,
            );

        if (!exists) {
            throw new ConversationNotFoundError(
                conversationId,
            );
        }

        const conversation =
            await conversationRepository.update(
                conversationId,
                {
                    ...input,

                    updatedAt:
                        new Date(),
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
        const exists =
            await conversationRepository.exists(
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

export const conversationService =
    new ConversationService();