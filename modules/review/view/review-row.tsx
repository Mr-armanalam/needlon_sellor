import React, { useState } from 'react';
import { Star, CornerDownRight, ShieldAlert, Reply, Send } from 'lucide-react';

export default function ReviewRow({ review, onReport }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState(review.reply || '');
  const [hasSubmittedReply, setHasSubmittedReply] = useState(!!review.reply);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setHasSubmittedReply(true);
    setIsReplying(false);
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4 transition-all hover:border-gray-200">
      {/* Row Header Metas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50 pb-3">
        <div className="flex items-center gap-3">
          <img src={review.avatar} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-50" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{review.customerName}</h4>
            <p className="text-[11px] text-gray-400">Verified Buyer • {review.date}</p>
          </div>
        </div>

        {/* Dynamic Star Clusters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
            ))}
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
            Item: {review.productTitle}
          </span>
        </div>
      </div>

      {/* Review Body Content */}
      <div className="space-y-1">
        {review.title && <h5 className="text-sm font-bold text-gray-900">"{review.title}"</h5>}
        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
      </div>

      {/* Nested Persistent Reply Template */}
      {hasSubmittedReply && (
        <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3 border border-slate-100">
          <CornerDownRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-900">Your Response (Store Manager)</p>
            <p className="text-xs text-gray-600 leading-relaxed">{replyText}</p>
          </div>
        </div>
      )}

      {/* Dynamic Action Buttons Group */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          {!hasSubmittedReply && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
            >
              <Reply className="w-3.5 h-3.5" /> {isReplying ? 'Cancel Reply' : 'Reply to Customer'}
            </button>
          )}
          <button
            onClick={() => onReport(review.id)}
            className="text-xs font-medium text-gray-400 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Flag Review
          </button>
        </div>
      </div>

      {/* Expanding Form Input Block */}
      {isReplying && (
        <form onSubmit={handleSendReply} className="flex gap-2 animate-in fade-in duration-200 pt-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your public response here..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/10 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}