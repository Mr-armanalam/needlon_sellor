import React, { useState } from 'react';
import { Search, Check, CheckCheck, Circle } from 'lucide-react';

const mockConversations = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    lastMessage: 'Is the order #1024 shipped yet?',
    time: '12:45 PM',
    unread: 2,
    online: true,
    status: 'delivered'
  },
  {
    id: 2,
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lastMessage: 'Thanks for the quick update!',
    time: '10:30 AM',
    unread: 0,
    online: false,
    status: 'read'
  }
];

export default function ConversationList({ onSelectConversation, activeId }) {
  const [search, setSearch] = useState('');

  return (
    <div className="w-full md:w-80 h-full border-r border-gray-200 bg-white flex flex-col">
      {/* Header & Search */}
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800 mb-3">Messages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transitional-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {mockConversations.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectConversation(chat.id)}
            className={`w-full text-left p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
              activeId === chat.id ? 'bg-blue-50/60 hover:bg-blue-50/60' : ''
            }`}
          >
            {/* Avatar block with online indicator */}
            <div className="relative flex-shrink-0">
              <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-full object-cover" />
              {chat.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>

            {/* Info details */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h2 className="text-sm font-semibold text-gray-900 truncate">{chat.name}</h2>
                <span className="text-xs text-gray-400 whitespace-nowrap">{chat.time}</span>
              </div>
              
              <div className="flex items-center justify-between gap-1">
                <p className={`text-xs truncate ${chat.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {chat.lastMessage}
                </p>
                
                {chat.unread > 0 ? (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center">
                    {chat.unread}
                  </span>
                ) : (
                  chat.status === 'read' ? (
                    <CheckCheck className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                  ) : (
                    <Check className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  )
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}