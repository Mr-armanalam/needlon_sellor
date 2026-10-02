import {MessageDto} from "@/modules/message";
import React from "react";
import {getMessageTypeLabel} from "@/modules/message/lib/get-message-type-label";

interface ReplyPreviewProps {
    message:
        MessageDto;
}

export function ReplyPreview({
                          message,
                      }: ReplyPreviewProps) {
    if (!message.replyTo) {
        return null;
    }

    return (
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 max-w-sm">
            <p className="text-[11px] font-semibold text-gray-600 truncate">
                {message.replyTo.senderName}
            </p>

            <p className="text-xs text-gray-500 truncate mt-0.5">
                {message.replyTo.isDeleted
                    ? "Message deleted"
                    : message.replyTo.body ??
                    getMessageTypeLabel(
                        message.replyTo
                            .messageType,
                    )}
            </p>
        </div>
    );
}