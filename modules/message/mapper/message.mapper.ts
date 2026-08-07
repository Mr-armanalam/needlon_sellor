// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/mapper/message.mapper.ts
// Description:
// Maps database message entities into MessageDto.
// ============================================================================

import {
    MessageAttachmentDto,
    MessageDto,
    MessageReactionDto,
    MessageSenderDto,
    ReplyMessageDto,
} from "../dto";

interface MessageSenderEntity {
    id: string;

    name: string;

    avatarUrl: string | null;
}

interface ReplyMessageEntity {
    id: string;

    senderName: string;

    body: string | null;

    messageType: MessageDto["messageType"];

    isDeleted: boolean;
}

interface MessageEntity {
    id: string;

    conversationId: string;

    messageType: MessageDto["messageType"];

    status: MessageDto["status"];

    body: string | null;

    sender: MessageSenderEntity;

    replyTo: ReplyMessageEntity | null;

    attachments: MessageAttachmentDto[];

    reactions: MessageReactionDto[];

    isReadByEveryone: boolean;

    isEdited: boolean;

    isDeleted: boolean;

    isOwnMessage: boolean;

    createdAt: Date;

    updatedAt: Date | null;

    editedAt: Date | null;

    deletedAt: Date | null;
}

function toMessageSenderDto(
    sender: MessageSenderEntity,
): MessageSenderDto {
    return {
        id: sender.id,

        name: sender.name,

        avatarUrl: sender.avatarUrl,
    };
}

function toReplyMessageDto(
    reply: ReplyMessageEntity,
): ReplyMessageDto {
    return {
        id: reply.id,

        senderName:
        reply.senderName,

        body:
        reply.body,

        messageType:
        reply.messageType,

        isDeleted:
        reply.isDeleted,
    };
}

export function toMessageDto(
    message: MessageEntity,
): MessageDto {
    return {
        id:
        message.id,

        conversationId:
        message.conversationId,

        sender:
            toMessageSenderDto(
                message.sender,
            ),

        messageType:
        message.messageType,

        status:
        message.status,

        body:
        message.body,

        replyTo:
            message.replyTo
                ? toReplyMessageDto(
                    message.replyTo,
                )
                : null,

        attachments:
        message.attachments,

        reactions:
        message.reactions,

        attachmentCount:
        message.attachments.length,

        reactionCount:
        message.reactions.length,

        isReadByEveryone:
        message.isReadByEveryone,

        isEdited:
        message.isEdited,

        isDeleted:
        message.isDeleted,

        isOwnMessage:
        message.isOwnMessage,

        createdAt:
            message.createdAt.toISOString(),

        updatedAt:
            message.updatedAt?.toISOString() ??
            null,

        editedAt:
            message.editedAt?.toISOString() ??
            null,

        deletedAt:
            message.deletedAt?.toISOString() ??
            null,
    };
}