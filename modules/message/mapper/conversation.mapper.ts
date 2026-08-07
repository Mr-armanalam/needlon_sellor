// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/mapper/conversation.mapper.ts
// Description:
// Maps database conversation entities into ConversationDto.
// ============================================================================

import {
    ConversationDto,
    ConversationLastMessageDto,
    ConversationMemberDto,
} from "../dto";

interface ConversationEntity {
    id: string;

    type: ConversationDto["type"];

    status: ConversationDto["status"];

    title: string | null;

    avatarUrl?: string | null;

    description?: string | null;

    createdAt: Date;

    updatedAt: Date;
}

interface ConversationMemberEntity {
    sellerId: string;

    displayName: string;

    avatarUrl: string | null;

    role: ConversationMemberDto["role"];

    isOnline: boolean;

    lastSeenAt: Date | null;
}

interface ConversationLastMessageEntity {
    id: string;

    senderId: string;

    senderName: string | null;

    body: string | null;

    messageType: string;

    createdAt: Date;

    isDeleted: boolean;
}

interface Params {
    conversation: ConversationEntity;

    currentSellerId: string;

    memberCount: number;

    unreadCount: number;

    isPinned: boolean;

    isMuted: boolean;

    isArchived: boolean;

    isActive: boolean;

    members: ConversationMemberEntity[];

    lastMessage:
        | ConversationLastMessageEntity
        | null;
}

function toConversationMemberDto(
    member: ConversationMemberEntity,
): ConversationMemberDto {
    return {
        sellerId:
        member.sellerId,

        displayName:
        member.displayName,

        avatarUrl:
        member.avatarUrl,

        role:
        member.role,

        isOnline:
        member.isOnline,

        lastSeenAt:
            member.lastSeenAt?.toISOString() ??
            null,
    };
}

function toConversationLastMessageDto(
    message: ConversationLastMessageEntity,
): ConversationLastMessageDto {
    return {
        id: message.id,

        senderId:
        message.senderId,

        senderName:
        message.senderName,

        body:
        message.body,

        messageType:
        message.messageType,

        createdAt:
            message.createdAt.toISOString(),

        isDeleted:
        message.isDeleted,
    };
}

export function toConversationDto({
                                      conversation,
                                      currentSellerId,
                                      memberCount,
                                      unreadCount,
                                      isPinned,
                                      isMuted,
                                      isArchived,
                                      isActive,
                                      members,
                                      lastMessage,
                                  }: Params): ConversationDto {
    return {
        id:
        conversation.id,

        type:
        conversation.type,

        status:
        conversation.status,

        title:
        conversation.title,

        avatarUrl:
        conversation.avatarUrl ?? null,

        description:
        conversation.description ?? null,

        currentSellerId,

        memberCount,

        unreadCount,

        isPinned,

        isMuted,

        isArchived,

        isActive,

        lastMessage:
            lastMessage
                ? toConversationLastMessageDto(
                    lastMessage,
                )
                : null,

        members:
            members.map(
                toConversationMemberDto,
            ),

        createdAt:
            conversation.createdAt.toISOString(),

        updatedAt:
            conversation.updatedAt.toISOString(),
    };
}