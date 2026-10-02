import React from 'react';
import { X } from "lucide-react";
import {MessageDto} from "@/modules/message";

const ReplyTargetPreview = ({ replyTarget, onCancelReply }: { replyTarget?: MessageDto | null; onCancelReply: () => void }) => {
    return (
        replyTarget && (
            <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100/50 rounded-xl px-4 py-2.5 animate-in slide-in-from-bottom-1 duration-150">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-blue-600">Replying to {replyTarget.sender.name}</p>
                    <p className="text-xs text-gray-600 truncate mt-0.5">{replyTarget.body || "Attachment"}</p>
                </div>
                <button
                    type="button"
                    onClick={onCancelReply}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        )
    );
};

export default ReplyTargetPreview;