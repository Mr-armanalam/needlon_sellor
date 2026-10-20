// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/mapper/message.mapper.ts
// Description:
// Maps database message entities into MessageDto.
// ============================================================================

import {
    sharedOrdersTable,
    sharedProductsTable,
} from "@/db/schema/messages";

import {
    MessageAttachmentDto,
    MessageDto,
    MessageReactionDto,
    MessageSenderDto,
    ReplyMessageDto,
} from "../dto";

/**
 * Product snapshot shared inside a message, as hydrated by
 * MessageService from a sharedProductsTable row (prices parsed
 * from their stored numeric strings into numbers).
 */
export type SharedProductSnapshot = Pick<
    typeof sharedProductsTable.$inferSelect,
    | "id"
    | "productId"
    | "productName"
    | "slug"
    | "sku"
    | "brand"
    | "thumbnailUrl"
    | "currency"
> & {
    sellingPrice: number;

    mrp: number | null;
};

/**
 * Order snapshot shared inside a message, as hydrated by
 * MessageService from a sharedOrdersTable row (total parsed
 * from its stored numeric string into a number).
 */
export type SharedOrderSnapshot = Pick<
    typeof sharedOrdersTable.$inferSelect,
    | "id"
    | "orderId"
    | "orderNumber"
    | "buyerName"
    | "sellerName"
    | "currency"
    | "status"
    | "deliveryStatus"
    | "paymentStatus"
    | "trackingNumber"
    | "courierName"
> & {
    totalAmount: number;
};

/**
 * MessageDto shape actually produced by this mapper: the shared
 * product / order are the snapshots above, passed through as-is.
 */
export type MappedMessageDto = Omit<
    MessageDto,
    "sharedProduct" | "sharedOrder"
> & {
    sharedProduct: SharedProductSnapshot | null;

    sharedOrder: SharedOrderSnapshot | null;
};

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

    sharedProduct: SharedProductSnapshot | null;

    sharedOrder: SharedOrderSnapshot | null;
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
): MappedMessageDto {
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

        sharedProduct:
        message.sharedProduct,

        sharedOrder:
        message.sharedOrder,
    };
}