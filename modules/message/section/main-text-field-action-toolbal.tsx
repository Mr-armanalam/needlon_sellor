import React from 'react';
import {Mic, Paperclip, Send, Smile} from "lucide-react";

const MainTextFieldActionToolbal = (
    {
        text,
        setText,
        handleSubmit,
        isSending,
        isUploading,
        canSubmit,
        fileInputRef,
        setShowEmojiPicker
    }: {
        text: string;
        setText: (text: string) => void;
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
        isSending: boolean;
        isUploading: boolean;
        canSubmit: boolean;
        fileInputRef: React.RefObject<HTMLInputElement>;
        setShowEmojiPicker:  React.Dispatch<React.SetStateAction<boolean>>;
    }
) => {
    return (
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

    );
};

export default MainTextFieldActionToolbal;