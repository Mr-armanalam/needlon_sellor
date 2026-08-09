import {ConversationDto} from "@/modules/message";

export function getConversationDisplayName(
    conversation: ConversationDto,
): string {
    if (conversation.title) {
        return conversation.title;
    }

    const otherMember =
        conversation.members.find(
            (member) =>
                member.sellerId !==
                conversation.currentSellerId,
        );

    return (
        otherMember?.displayName ??
        "Conversation"
    );
}