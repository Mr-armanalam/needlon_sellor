import {ConversationDto} from "@/modules/message";
import {getMessageTypeLabel} from "@/modules/message/lib/get-message-type-label";

export function getLastMessagePreview(
    conversation: ConversationDto,
): string {
    const lastMessage =
        conversation.lastMessage;

    if (!lastMessage) {
        return "No messages yet";
    }

    if (lastMessage.isDeleted) {
        return "Message deleted";
    }

    if (lastMessage.body) {
        return lastMessage.body;
    }

    return getMessageTypeLabel(
        lastMessage.messageType,
    );
}
