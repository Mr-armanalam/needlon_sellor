import {ConversationDto} from "@/modules/message";

export function getConversationAvatarUrl(
    conversation: ConversationDto,
): string | null {
    if (conversation.avatarUrl) {
        return conversation.avatarUrl;
    }

    const otherMember =
        conversation.members.find(
            (member) =>
                member.sellerId !==
                conversation.currentSellerId,
        );

    return (
        otherMember?.avatarUrl ??
        null
    );
}