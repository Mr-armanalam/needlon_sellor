import React from 'react';
import { ShoppingBag, Package, Check, CheckCheck, MoreVertical } from 'lucide-react';

export default function ChatWindow({ messages, isTyping }) {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 min-h-0">
      {/* 1. Chat Header (Audio/Video removed for Seller Dashboard) */}
      <div className="h-16 px-6 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" 
              alt="Sarah Jenkins" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Sarah Jenkins</h2>
            <p className="text-xs text-gray-400">Customer</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-500">
          <button className="hover:text-gray-700 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
        {messages.map((msg) => {
          const isMe = msg.sender === 'me';
          return (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
              {!isMe && (
                <img src={msg.avatar} alt="" className="w-8 h-8 rounded-full object-cover mt-0.5 flex-shrink-0" />
              )}
              
              <div className="space-y-2">
                {msg.text && (
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                )}

                {msg.type === 'product' && msg.product && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex gap-3 max-w-sm">
                    <img src={msg.product.image} alt="" className="w-20 h-20 rounded-xl object-cover bg-gray-50 flex-shrink-0" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 truncate">{msg.product.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{msg.product.price}</p>
                      </div>
                      <button className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors">
                        <ShoppingBag className="w-3.5 h-3.5" /> View Product
                      </button>
                    </div>
                  </div>
                )}

                {msg.type === 'order' && msg.order && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm max-w-sm">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-2.5 mb-2.5">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-gray-900">{msg.order.id}</span>
                      </div>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                        {msg.order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Est. Delivery: <span className="font-medium text-gray-800">{msg.order.date}</span></p>
                  </div>
                )}

                <div className={`flex items-center gap-1.5 text-[10px] text-gray-400 ${isMe ? 'justify-end' : ''}`}>
                  <span>{msg.time}</span>
                  {isMe && (
                    msg.status === 'read' ? (
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-gray-300" />
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 items-center max-w-[70%]">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" alt="" className="w-8 h-8 rounded-full object-cover" />
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}