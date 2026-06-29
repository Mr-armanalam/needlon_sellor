import React, { useState } from 'react';
import { Smile, Paperclip, Send, Mic } from 'lucide-react';

const mockQuickReplies = [
  'Is this item still available?',
  'Track my order updates',
  'Check delivery status'
];

export default function MessageInput({ onSendMessage, onQuickReplyClick }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4 space-y-3 flex-shrink-0">
      {/* 1. Quick Replies Chips Container */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mask-right">
        {mockQuickReplies.map((reply, index) => (
          <button
            key={index}
            onClick={() => onQuickReplyClick(reply)}
            className="whitespace-nowrap text-xs bg-gray-50 border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 px-3 py-1.5 rounded-full transition-all flex-shrink-0 font-medium"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* 2. Main Text Field Action Toolbar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
        {/* Attachment Options */}
        <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
          <Paperclip className="w-5 h-5" />
        </button>
        
        {/* Main Text Area */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 bg-transparent border-0 text-sm focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400 p-0"
        />

        {/* Emojis & Voice Placeholders */}
        <div className="flex items-center gap-2.5 border-r border-gray-200 pr-2.5 text-gray-400">
          <button type="button" className="hover:text-gray-600 transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <button 
            type="button" 
            className="hover:text-gray-600 transition-colors"
            title="Voice Messaging (Coming Soon)"
          >
            <Mic className="w-5 h-5 opacity-60 cursor-not-allowed" />
          </button>
        </div>

        {/* Action Trigger Button */}
        <button
          type="submit"
          disabled={!text.trim()}
          className={`p-2 rounded-xl transition-all ${
            text.trim() 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}