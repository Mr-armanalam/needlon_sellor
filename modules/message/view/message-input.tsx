import React, { useState, useRef } from "react";
import { Smile, Paperclip, Send, Mic, X, FileText } from "lucide-react";
import { MessageDto } from "../dto";

const mockQuickReplies = [
  "Is this item still available?",
  "Track my order updates",
  "Check delivery status"
];

interface MessageInputProps {
  onSendMessage: (text: string, attachments?: { attachmentId: string; sortOrder: number; }[]) => void;
  onQuickReplyClick: (reply: string) => void;
  isSending?: boolean;
  replyTarget?: MessageDto | null;
  onCancelReply?: () => void;
}

export default function MessageInput({
  onSendMessage,
  onQuickReplyClick,
  isSending,
  replyTarget,
  onCancelReply,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{ id: string; name: string; size: number; type: string; url: string; storagePath?: string; }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = ["😀", "😂", "😍", "👍", "🔥", "👏", "❤️", "🙌", "🎉", "💡", "🤔", "👀", "❌", "✅"];

  const handleEmojiClick = (emoji: string) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    try {
      const files = Array.from(e.target.files);
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await fetch("/api/messages/upload", {
          method: "POST",
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          setSelectedFiles((prev) => [
            ...prev,
            {
              id: data.attachmentId,
              name: file.name,
              size: file.size,
              type: file.type,
              url: data.url,
              storagePath: data.storagePath,
            },
          ]);
        }
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasText = text.trim().length > 0;
    const hasFiles = selectedFiles.length > 0;
    if ((!hasText && !hasFiles) || isSending || isUploading) return;
    
    const attachmentsPayload = selectedFiles.map((file, idx) => ({
      attachmentId: file.id,
      sortOrder: idx,
      type: file.type.startsWith("image/") ? "IMAGE" : "FILE",
      fileName: file.name,
      originalFileName: file.name,
      storagePath: file.storagePath || file.name,
      contentType: file.type,
      fileSize: file.size,
    }));
    
    onSendMessage(text, attachmentsPayload);
    setText("");
    setSelectedFiles([]);
  };

  const canSubmit = (text.trim().length > 0 || selectedFiles.length > 0) && !isSending && !isUploading;

  return (
    <div className="bg-white border-t border-gray-200 p-4 space-y-3 flex-shrink-0 relative">
      
      {/* 1. Quick Replies Chips Container */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mask-right">
        {mockQuickReplies.map((reply, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onQuickReplyClick(reply)}
            className="whitespace-nowrap text-xs bg-gray-50 border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 px-3 py-1.5 rounded-full transition-all flex-shrink-0 font-medium"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Reply target preview */}
      {replyTarget && (
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
      )}

      {/* File uploads preview */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-1 duration-150">
          {selectedFiles.map((file, idx) => (
            <div key={file.id} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-2 pr-3 text-xs">
              {file.type.startsWith("image/") ? (
                <img src={file.url} alt="" className="w-8 h-8 rounded-lg object-cover bg-gray-100" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-700 truncate max-w-[120px]">{file.name}</p>
                <p className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Emoji picker popover */}
      {showEmojiPicker && (
        <div className="absolute right-12 bottom-16 bg-white border border-gray-100 rounded-2xl shadow-xl p-3 flex gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleEmojiClick(emoji)}
              className="text-lg hover:scale-125 transition-transform duration-75"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* 2. Main Text Field Action Toolbar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
        {/* Attachment Options */}
        <button
          type="button"
          disabled={isSending || isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          title="Attach files"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        
        {/* Main Text Area */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isUploading ? "Uploading file..." : "Type your message here..."}
          disabled={isSending || isUploading}
          className="flex-1 bg-transparent border-0 text-sm focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400 p-0 disabled:opacity-50"
        />

        {/* Emojis & Voice Placeholders */}
        <div className="flex items-center gap-2.5 border-r border-gray-200 pr-2.5 text-gray-400">
          <button
            type="button"
            disabled={isSending}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="hover:text-gray-600 transition-colors disabled:opacity-50"
            title="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
          <button 
            type="button" 
            className="hover:text-gray-600 transition-colors"
            title="Voice Messaging (Coming Soon)"
            disabled={true}
          >
            <Mic className="w-5 h-5 opacity-60 cursor-not-allowed" />
          </button>
        </div>

        {/* Action Trigger Button */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`p-2 rounded-xl transition-all ${
            canSubmit
              ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}