// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/service/message.service.ts
// Description:
// Business logic for Message management.
// ============================================================================

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
     * Send Message
     * =========================================================================
     */

    async sendMessage(
        input: SendMessageDto,
        currentSellerId: string,
    ) {
        const now =
            new Date();

        const message =
            await messageRepository.create({
                conversationId:
                input.conversationId,

                senderId:
                currentSellerId,

                type:
                input.messageType,

                text:
                input.body,

                replyToMessageId:
                input.replyToMessageId,

                createdAt:
                now,

                updatedAt:
                now,
            });

        return toMessageDto({
            id:
            message.id,

            conversationId:
            message.conversationId,

            sender: {
                id:
                currentSellerId,

                name:
                    "",

                avatarUrl:
                    null,
            },

            messageType:
            message.type,

            status:
            message.status,

            body:
            message.text,

            replyTo:
                null,

            attachments:
                [],

            reactions:
                [],

            isReadByEveryone:
                false,

            isEdited:
                false,

            isDeleted:
                false,

            isOwnMessage:
                true,

            createdAt:
            message.createdAt,

            updatedAt:
            message.updatedAt,

            editedAt:
                null,

            deletedAt:
                null,
        });
    }

    /**
     * =========================================================================
     * Get Message
     * =========================================================================
     */

    async getMessage(
        messageId: string,
    ) {
        const message =
            await messageRepository.findById(
                messageId,
            );

        if (!message) {
            throw new MessageNotFoundError(
                messageId,
            );
        }

        return toMessageDto({
            id:
            message.id,

            conversationId:
            message.conversationId,

            sender: {
                id:
                message.senderId,

                name:
                    "",

                avatarUrl:
                    null,
            },

            messageType:
            message.type,

            status:
            message.status,

            body:
            message.text,

            replyTo:
                null,

            attachments:
                [],

            reactions:
                [],

            isReadByEveryone:
                false,

            isEdited:
                false,

            isDeleted:
                message.deletedAt !==
                null,

            isOwnMessage:
                false,

            createdAt:
            message.createdAt,

            updatedAt:
            message.updatedAt,

            editedAt:
                null,

            deletedAt:
            message.deletedAt,

        });
    }

    /**
     * =========================================================================
     * Get Conversation Messages
     * =========================================================================
     */

    async getConversationMessages(
        conversationId: string,
    ) {
        const messages =
            await messageRepository.findConversationMessages(
                conversationId,
            );

        return messages.map(
            (message) =>
                toMessageDto({
                    id:
                    message.id,

                    conversationId:
                    message.conversationId,

                    sender: {
                        id:
                        message.senderId,

                        name:
                            "",

                        avatarUrl:
                            null,
                    },

                    messageType:
                    message.type,

                    status:
                    message.status,

                    body:
                    message.text,

                    replyTo:
                        null,

                    attachments:
                        [],

                    reactions:
                        [],

                    isReadByEveryone:
                        false,

                    isEdited:
                        false,

                    isDeleted:
                        message.deletedAt !==
                        null,

                    isOwnMessage:
                        false,

                    createdAt:
                    message.createdAt,

                    updatedAt:
                    message.updatedAt,

                    editedAt:
                        null,

                    deletedAt:
                    message.deletedAt,
                }),
        );
    }

    /**
     * =========================================================================
     * Get Latest Message
     * =========================================================================
     */

    async getLatestMessage(
        conversationId: string,
    ) {
        const message =
            await messageRepository.findLatestMessage(
                conversationId,
            );

        if (!message) {
            return null;
        }

        return toMessageDto({
            id:
            message.id,

            conversationId:
            message.conversationId,

            sender: {
                id:
                message.senderId,

                name:
                    "",

                avatarUrl:
                    null,
            },

            messageType:
            message.type,

            status:
            message.status,

            body:
            message.text,

            replyTo:
                null,

            attachments:
                [],

            reactions:
                [],

            isReadByEveryone:
                false,

            isEdited:
                false,

            isDeleted:
                message.deletedAt !==
                null,

            isOwnMessage:
                false,

            createdAt:
            message.createdAt,

            updatedAt:
            message.updatedAt,

            editedAt:
                null,

            deletedAt:
            message.deletedAt,
        });
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
        const existingMessage =
            await messageRepository.findById(
                input.messageId,
            );

        if (!existingMessage) {
            throw new MessageNotFoundError(
                input.messageId,
            );
        }

        if (
            existingMessage.senderId !==
            currentSellerId
        ) {
            throw new Error(
                "Only the message sender can update the message.",
            );
        }

        const message =
            await messageRepository.update(
                input.messageId,
                {
                    text:
                    input.body,

                    updatedAt:
                        new Date(),
                },
            );

        if (!message) {
            throw new MessageNotFoundError(
                input.messageId,
            );
        }

        return toMessageDto({
            id:
            message.id,

            conversationId:
            message.conversationId,

            sender: {
                id:
                message.senderId,

                name:
                    "",

                avatarUrl:
                    null,
            },

            messageType:
            message.type,

            status:
            message.status,

            body:
            message.text,

            replyTo:
                null,

            attachments:
                [],

            reactions:
                [],

            isReadByEveryone:
                false,

            isEdited:
                true,

            isDeleted:
                false,

            isOwnMessage:
                true,

            createdAt:
            message.createdAt,

            updatedAt:
            message.updatedAt,

            editedAt:
                new Date(),

            deletedAt:
                null,
        });
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
        const message =
            await messageRepository.findById(
                messageId,
            );

        if (!message) {
            throw new MessageNotFoundError(
                messageId,
            );
        }

        if (
            message.senderId !==
            currentSellerId
        ) {
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

export const messageService =
    new MessageService();