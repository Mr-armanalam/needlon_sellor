import {MessageDto} from "@/modules/message";
import {Check, CheckCheck, Download, FileText} from "lucide-react";
import React from "react";

interface AttachmentSummaryProps {
    message:
        MessageDto;
}

export function AttachmentSummary({
                               message,
                           }: AttachmentSummaryProps) {
    const isMe = message.isOwnMessage;
    return (
        <div className={`flex flex-col gap-2 max-w-sm ${isMe ? 'items-end' : 'items-start'}`}>
            {message.attachments.map((att) => {
                const isImage = att.attachmentType === "IMAGE" || att.mimeType?.startsWith("image/");

                if (isImage) {
                    return (
                        <a
                            key={att.id}
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:opacity-95 transition-opacity"
                        >
                            <img src={att.url} alt={att.fileName} className="max-w-[240px] max-h-[180px] object-cover bg-gray-50" />
                        </a>
                    );
                }

                return (
                    <div key={att.id} className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-gray-900 truncate max-w-[150px]">{att.fileName}</p>
                            <p className="text-[10px] text-gray-400">{(att.fileSize / 1024).toFixed(1)} KB</p>
                        </div>
                        <a
                            href={att.url}
                            download={att.fileName}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
                        >
                            <Download className="w-4 h-4" />
                        </a>
                    </div>
                );
            })}
        </div>
    );
}
