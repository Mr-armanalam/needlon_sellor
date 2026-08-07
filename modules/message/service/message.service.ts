// ============================================================================
// Needlon
// Messages Module
// File: modules/message/service/message.service.ts
// Description:
// Business logic for Message management.
// ============================================================================

import { db } from "@/db";
import { seller } from "@/db/schema/seller";
import { sellerProfiles } from "@/db/schema/seller/seller-profile";
import {
    messagesTable,
    messageAttachmentsTable,
    messageReactionsTable,
    messageReadsTable,
    sharedProductsTable,
    sharedOrdersTable,
} from "@/db/schema/messages";
import { eq, inArray } from "drizzle-orm";

import {
    toMessageDto,
} from "../mapper";

import {
    messageRepository,
} from "../repository";

import {
    MessageNotFoundError,
} from "../errors";

import {
    SendMessageDto,
    UpdateMessageDto,
} from "../dto";

export class MessageService {
    /**
     * =========================================================================
     * Private Helpers
     * =========================================================================
     */

    private async hydrateMessages(
        rawMessages: any[],
        currentSellerId: string,
    ) {
        if (rawMessages.length === 0) {
            return [];
        }

        const messageIds = rawMessages.map((m) => m.id);
        const senderIds = Array.from(new Set(rawMessages.map((m) => m.senderId)));

        // 1. Fetch senders (joined with profiles)
        const senders = await db
            .select({
                id: seller.id,
                name: seller.name,
                displayName: sellerProfiles.displayName,
                avatarUrl: sellerProfiles.profileImageUrl,
            })
            .from(seller)
            .leftJoin(sellerProfiles, eq(seller.id, sellerProfiles.sellerId))
            .where(inArray(seller.id, senderIds));

        const senderMap = new Map(
            senders.map((s) => [
                s.id,
                {
                    id: s.id,
                    name: s.displayName || s.name || "User",
                    avatarUrl: s.avatarUrl || null,
                },
            ]),
        );

        // 2. Fetch reply-to parent messages
        const parentIds = Array.from(
            new Set(
                rawMessages
                    .map((m) => m.replyToMessageId)
                    .filter(Boolean),
            ),
        ) as string[];

        let replyToMap = new Map<string, any>();
        if (parentIds.length > 0) {
            const parents = await db
                .select({
                    id: messagesTable.id,
                    body: messagesTable.text,
                    messageType: messagesTable.type,
                    deletedAt: messagesTable.deletedAt,
                    senderName: seller.name,
                    senderDisplayName: sellerProfiles.displayName,
                })
                .from(messagesTable)
                .leftJoin(seller, eq(messagesTable.senderId, seller.id))
                .leftJoin(sellerProfiles, eq(seller.id, sellerProfiles.sellerId))
                .where(inArray(messagesTable.id, parentIds));

            replyToMap = new Map(
                parents.map((p) => [
                    p.id,
                    {
                        id: p.id,
                        senderName: p.senderDisplayName || p.senderName || "User",
                        body: p.body,
                        messageType: p.messageType,
                        isDeleted: p.deletedAt !== null,
                    },
                ]),
            );
        }

        // 3. Fetch attachments
        const attachments = await db
            .select()
            .from(messageAttachmentsTable)
            .where(inArray(messageAttachmentsTable.messageId, messageIds));

        const attachmentsMap = new Map<string, any[]>();
        for (const att of attachments) {
            const list = attachmentsMap.get(att.messageId) || [];
            list.push({
                id: att.id,
                messageId: att.messageId,
                attachmentType: att.type,
                fileName: att.originalFileName || att.fileName,
                mimeType: att.contentType,
                url: `/api/storage/${att.storagePath}`,
                thumbnailUrl: null,
                fileSize: att.fileSize,
                width: null,
                height: null,
                duration: null,
                uploaded: att.status === "COMPLETED",
                uploadedAt: att.updatedAt?.toISOString() ?? null,
                createdAt: att.createdAt.toISOString(),
            });
            attachmentsMap.set(att.messageId, list);
        }

        // 4. Fetch reactions
        const reactions = await db
            .select({
                reaction: messageReactionsTable,
                senderName: seller.name,
                senderDisplayName: sellerProfiles.displayName,
                senderAvatar: sellerProfiles.profileImageUrl,
            })
            .from(messageReactionsTable)
            .leftJoin(seller, eq(messageReactionsTable.sellerId, seller.id))
            .leftJoin(sellerProfiles, eq(seller.id, sellerProfiles.sellerId))
            .where(inArray(messageReactionsTable.messageId, messageIds));

        const reactionsMap = new Map<string, any[]>();
        for (const rx of reactions) {
            const list = reactionsMap.get(rx.reaction.messageId) || [];
            list.push({
                id: rx.reaction.id,
                messageId: rx.reaction.messageId,
                seller: {
                    id: rx.reaction.sellerId,
                    name: rx.senderDisplayName || rx.senderName || "User",
                    avatarUrl: rx.senderAvatar || null,
                },
                reaction: rx.reaction.reaction,
                isOwnReaction: rx.reaction.sellerId === currentSellerId,
                createdAt: rx.reaction.createdAt.toISOString(),
            });
            reactionsMap.set(rx.reaction.messageId, list);
        }

        // 5. Fetch read receipts
        const reads = await db
            .select()
            .from(messageReadsTable)
            .where(inArray(messageReadsTable.messageId, messageIds));

        const readsMap = new Map<string, any[]>();
        for (const rd of reads) {
            const list = readsMap.get(rd.messageId) || [];
            list.push(rd);
            readsMap.set(rd.messageId, list);
        }

        // 6. Fetch shared products
        const sharedProducts = await db
            .select()
            .from(sharedProductsTable)
            .where(inArray(sharedProductsTable.messageId, messageIds));

        const sharedProductsMap = new Map<string, any>();
        for (const sp of sharedProducts) {
            sharedProductsMap.set(sp.messageId, {
                id: sp.id,
                productId: sp.productId,
                productName: sp.productName,
                slug: sp.slug,
                sku: sp.sku,
                brand: sp.brand,
                thumbnailUrl: sp.thumbnailUrl,
                currency: sp.currency,
                sellingPrice: parseFloat(sp.sellingPrice),
                mrp: sp.mrp ? parseFloat(sp.mrp) : null,
            });
        }

        // 7. Fetch shared orders
        const sharedOrders = await db
            .select()
            .from(sharedOrdersTable)
            .where(inArray(sharedOrdersTable.messageId, messageIds));

        const sharedOrdersMap = new Map<string, any>();
        for (const so of sharedOrders) {
            sharedOrdersMap.set(so.messageId, {
                id: so.id,
                orderId: so.orderId,
                orderNumber: so.orderNumber,
                buyerName: so.buyerName,
                sellerName: so.sellerName,
                currency: so.currency,
                totalAmount: parseFloat(so.totalAmount),
                status: so.status,
                deliveryStatus: so.deliveryStatus,
                paymentStatus: so.paymentStatus,
                trackingNumber: so.trackingNumber,
                courierName: so.courierName,
            });
        }

        return rawMessages.map((message) => {
            const senderInfo = senderMap.get(message.senderId) || {
                id: message.senderId,
                name: "User",
                avatarUrl: null,
            };

            const parentInfo = message.replyToMessageId
                ? replyToMap.get(message.replyToMessageId)
                : null;
            const messageAttachments = attachmentsMap.get(message.id) || [];
            const messageReactions = reactionsMap.get(message.id) || [];
            const messageReads = readsMap.get(message.id) || [];
            const sharedProduct = sharedProductsMap.get(message.id) || null;
            const sharedOrder = sharedOrdersMap.get(message.id) || null;

            // Compute isReadByEveryone. If there are reads in messageReads, it's read by participants.
            const isReadByEveryone = messageReads.length > 0;

            return toMessageDto({
                id: message.id,
                conversationId: message.conversationId,
                sender: senderInfo,
                messageType: message.type,
                status: message.status,
                body: message.text,
                replyTo: parentInfo,
                attachments: messageAttachments,
                reactions: messageReactions,
                isReadByEveryone,
                isEdited: message.updatedAt > message.createdAt,
                isDeleted: message.deletedAt !== null,
                isOwnMessage: message.senderId === currentSellerId,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
                editedAt: message.editedAt || null,
                deletedAt: message.deletedAt || null,
                sharedProduct,
                sharedOrder,
            });
        });
    }


    /**
     * =========================================================================
     * Send Message
     * =========================================================================
     */

    async sendMessage(
        input: SendMessageDto,
        currentSellerId: string,
    ) {
        const now = new Date();

        const message = await messageRepository.create({
            conversationId: input.conversationId,
            senderId: currentSellerId,
            type: input.messageType,
            text: input.body,
            replyToMessageId: input.replyToMessageId,
            createdAt: now,
            updatedAt: now,
        });

        const [hydrated] = await this.hydrateMessages([message], currentSellerId);
        return hydrated;
    }

    /**
     * =========================================================================
     * Get Message
     * =========================================================================
     */

    async getMessage(
        messageId: string,
    ) {
        const message = await messageRepository.findById(messageId);

        if (!message) {
            throw new MessageNotFoundError(messageId);
        }

        let resolveSellerId = "";
        try {
            const { getSellerProfile } = await import("@/modules/seller-profile/services");
            const profile = await getSellerProfile();
            resolveSellerId = profile.sellerId;
        } catch {
            // Ignore error outside API context
        }

        const [hydrated] = await this.hydrateMessages([message], resolveSellerId);
        return hydrated;
    }

    /**
     * =========================================================================
     * Get Conversation Messages
     * =========================================================================
     */

    async getConversationMessages(
        conversationId: string,
        currentSellerId?: string,
    ) {
        let resolveSellerId = currentSellerId || "";
        if (!resolveSellerId) {
            try {
                const { getSellerProfile } = await import("@/modules/seller-profile/services");
                const profile = await getSellerProfile();
                resolveSellerId = profile.sellerId;
            } catch {
                // Ignore error outside API context
            }
        }

        const messages = await messageRepository.findConversationMessages(
            conversationId,
        );

        return this.hydrateMessages(messages, resolveSellerId);
    }

    /**
     * =========================================================================
     * Get Latest Message
     * =========================================================================
     */

    async getLatestMessage(
        conversationId: string,
        currentSellerId?: string,
    ) {
        const message = await messageRepository.findLatestMessage(
            conversationId,
        );

        if (!message) {
            return null;
        }

        const [hydrated] = await this.hydrateMessages([message], currentSellerId || "");
        return hydrated;
    }

    /**
     * =========================================================================
     * Update Message
     * =========================================================================
     */

    async updateMessage(
        input: UpdateMessageDto,
        currentSellerId: string,
    ) {
        const existingMessage = await messageRepository.findById(
            input.messageId,
        );

        if (!existingMessage) {
            throw new MessageNotFoundError(
                input.messageId,
            );
        }

        if (existingMessage.senderId !== currentSellerId) {
            throw new Error(
                "Only the message sender can update the message.",
            );
        }

        const message = await messageRepository.update(
            input.messageId,
            {
                text: input.body,
                updatedAt: new Date(),
            },
        );

        if (!message) {
            throw new MessageNotFoundError(
                input.messageId,
            );
        }

        const [hydrated] = await this.hydrateMessages([message], currentSellerId);
        return hydrated;
    }

    /**
     * =========================================================================
     * Delete Message
     * =========================================================================
     */

    async deleteMessage(
        messageId: string,
        currentSellerId: string,
    ) {
        const message = await messageRepository.findById(
            messageId,
        );

        if (!message) {
            throw new MessageNotFoundError(
                messageId,
            );
        }

        if (message.senderId !== currentSellerId) {
            throw new Error(
                "Only the message sender can delete the message.",
            );
        }

        await messageRepository.softDelete(
            messageId,
        );
    }

    /**
     * =========================================================================
     * Count Conversation Messages
     * =========================================================================
     */

    async countConversationMessages(
        conversationId: string,
    ) {
        return messageRepository.countConversationMessages(
            conversationId,
        );
    }
}

export const messageService = new MessageService();