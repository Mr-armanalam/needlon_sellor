import React, { useState, useRef } from "react";
import { MessageDto } from "../dto";
import QuickReplyContainer from "@/modules/message/section/quick-reply-container";
import MainTextFieldActionToolbal from "@/modules/message/section/main-text-field-action-toolbal";
import ReplyTargetPreview from "@/modules/message/components/reply-target-preview";
import FileUploadsPreview from "@/modules/message/components/file-uploads-preview";
import EmojiPickerPopover from "@/modules/message/components/emoji-picker-popover";

const quickReplies = [
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
      
      {/*  Quick Replies Chips Container */}
      <QuickReplyContainer
        mockQuickReplies={quickReplies}
        onQuickReplyClick={onQuickReplyClick}
      />

      {/* Reply target preview */}
      <ReplyTargetPreview
        replyTarget={replyTarget}
        onCancelReply={onCancelReply || (() => {})}
      />

      {/* File uploads preview */}
      <FileUploadsPreview
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
      />

      {/* Hidden file input */}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Emoji picker popover */}
      <EmojiPickerPopover
        showEmojiPicker={showEmojiPicker}
        handleEmojiClick={handleEmojiClick}
      />

      {/*  Main Text Field Action Toolbar */}
      <MainTextFieldActionToolbal
          text={text}
          setText={setText}
          handleSubmit={handleSubmit}
          isSending={isSending}
          isUploading={isUploading}
          canSubmit={canSubmit}
          fileInputRef={fileInputRef}
          setShowEmojiPicker={setShowEmojiPicker}
      />
    </div>
  );
}