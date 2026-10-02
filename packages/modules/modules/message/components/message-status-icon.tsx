import {MessageDto} from "@/modules/message";
import {Check, CheckCheck} from "lucide-react";
import React from "react";

interface MessageStatusIconProps {
    message:
        MessageDto;
}

export function MessageStatusIcon({
                               message,
                           }: MessageStatusIconProps) {
    if (
        message.isReadByEveryone
    ) {
        return (
            <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
        );
    }

    return (
        <Check className="w-3.5 h-3.5 text-gray-300" />
    );
}