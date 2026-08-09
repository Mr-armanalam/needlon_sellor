import {getConversationDisplayName} from "@/modules/message/lib/get-conversation-display-name";
import {ConversationDto} from "@/modules/message";
import {getConversationAvatarUrl} from "@/modules/message/lib/get-conversation-avatar-url";
import {getLastMessagePreview} from "@/modules/message/lib/get-last-message-preview";
import {formatConversationTime} from "@/modules/message/lib/format-conversation-time";
import {getInitials} from "@/modules/message/lib/get-initials";
import {isConversationOnline} from "@/modules/message/lib/is-conversation-online";
import {CheckCheck} from "lucide-react";

interface ConversationListItemProps {
    conversation:
        ConversationDto;

    active:
        boolean;

    onSelect:
        (
            conversationId: string,
        ) => void;
}

export function ConversationListItem({
                                  conversation,
                                  active,
                                  onSelect,
                              }: ConversationListItemProps) {
    const lastMessage =
        conversation.lastMessage;

    const displayName =
        getConversationDisplayName(
            conversation,
        );

    const avatarUrl =
        getConversationAvatarUrl(
            conversation,
        );

    const preview =
        getLastMessagePreview(
            conversation,
        );

    const time =
        formatConversationTime(
            lastMessage?.createdAt ??
            conversation.updatedAt,
        );

    const isOwnLastMessage =
        lastMessage?.senderId ===
        conversation.currentSellerId;

    return (
        <button
            type="button"
            onClick={() =>
                onSelect(
                    conversation.id,
                )
            }
            aria-current={
                active
                    ? "true"
                    : undefined
            }
            className={`w-full text-left p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                active
                    ? "bg-blue-50/60 hover:bg-blue-50/60"
                    : ""
            }`}
        >
            {/* Avatar block with online indicator */}
            <div className="relative flex-shrink-0">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt=""
                        className="w-11 h-11 rounded-full object-cover"
                    />
                ) : (
                    <div
                        aria-hidden="true"
                        className="w-11 h-11 rounded-full object-cover bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500"
                    >
                        {getInitials(
                            displayName,
                        )}
                    </div>
                )}

                {isConversationOnline(
                    conversation,
                ) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
            </div>

            {/* Info details */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                    <h2 className="text-sm font-semibold text-gray-900 truncate">
                        {displayName}
                    </h2>

                    <span className="text-xs text-gray-400 whitespace-nowrap">
                        {time}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-1">
                    <p
                        className={`text-xs truncate ${
                            conversation.unreadCount >
                            0
                                ? "text-gray-900 font-medium"
                                : "text-gray-500"
                        }`}
                    >
                        {preview}
                    </p>

                    {conversation.unreadCount >
                    0 ? (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center">
                            {
                                conversation.unreadCount
                            }
                        </span>
                    ) : (
                        isOwnLastMessage && (
                            <CheckCheck className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                        )
                    )}
                </div>
            </div>
        </button>
    );
}