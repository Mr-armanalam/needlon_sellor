import {MessageDto} from "@/modules/message";
import React from "react";
import {MessageStatusIcon} from "@/modules/message/components/message-status-icon";
import {formatMessageTime} from "@/modules/message/lib/format-message-time";

interface MessageMetaProps {
    message:
        MessageDto;
}

export function MessageMeta({
                         message,
                     }: MessageMetaProps) {
    const isMe =
        message.isOwnMessage;

    const createdAt =
        formatMessageTime(
            message.createdAt,
        );

    return (
        <div
            className={`flex items-center gap-1.5 text-[10px] text-gray-400 ${
                isMe
                    ? "justify-end"
                    : ""
            }`}
        >
            <span>
                {createdAt}
            </span>

            {message.isEdited && (
                <span>
                    · edited
                </span>
            )}

            {isMe && (
                <MessageStatusIcon
                    message={
                        message
                    }
                />
            )}
        </div>
    );
}