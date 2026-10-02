import {ConversationDto} from "@/modules/message";

export function isConversationOnline(
    conversation: ConversationDto,
): boolean {
    return conversation.members.some(
        (member) =>
            member.sellerId !==
            conversation.currentSellerId &&
            member.isOnline,
    );
}