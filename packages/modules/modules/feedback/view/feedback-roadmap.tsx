import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Plus, Layers, Flame, CheckCircle2, X, Send } from 'lucide-react';
import { useFeedback } from '../hooks/use-feedback';

interface FeedbackRoadmapProps {
  onCreateFeedbackClick?: () => void;
}

export default function FeedbackRoadmap({ onCreateFeedbackClick }: FeedbackRoadmapProps) {
  const { roadmapItems, loadingRoadmap, refetchRoadmap, toggleUpvote, fetchComments, addComment } = useFeedback();
  const [filterStatus, setFilterStatus] = useState('all');

  // Comments drawer state
  const [activeFeature, setActiveFeature] = useState<any | null>(null);
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    refetchRoadmap(status);
  };

  const handleOpenComments = async (item: any) => {
    setActiveFeature(item);
    setLoadingComments(true);
    const res = await fetchComments(item.id);
    if (res.success && res.comments) {
      setCommentsList(res.comments);
    } else {
      setCommentsList([]);
    }
    setLoadingComments(false);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeFeature) return;
    const res = await addComment(activeFeature.id, newCommentText.trim());
    if (res.success) {
      const newCommentObj = res.data || {
        id: Date.now().toString(),
        sellerName: 'You',
        comment: newCommentText.trim(),
        createdAt: new Date().toISOString()
      };
      setCommentsList(prev => [newCommentObj, ...prev]);
      setNewCommentText('');
    } else {
      alert(res.error || "Failed to post comment");
    }
  };

  return (
    <div className="space-y-6 flex-1 overflow-y-auto pr-1 min-h-0 animate-in fade-in duration-200">
      
      {/* 1. Header Hero Panel Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Tab Pill Filter Row */}
        <div className="bg-gray-50 border border-gray-100 p-1 rounded-xl flex flex-wrap items-center gap-1 shadow-inner">
          {[
            { id: 'all', label: 'All Items', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'planned', label: 'Planned', icon: <Flame className="w-3.5 h-3.5 text-amber-500" /> },
            { id: 'in-development', label: 'In Dev', icon: <Flame className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> },
            { id: 'released', label: 'Released', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                filterStatus === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Trigger */}
        <button
          onClick={onCreateFeedbackClick}
          className="bg-blue-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Share Idea / Request Feature
        </button>
      </div>

      {/* 2. Interactive Feature Request Voting Stream Grid */}
      {loadingRoadmap ? (
        <div className="p-8 text-center text-xs text-gray-400">Loading feature roadmap from database...</div>
      ) : roadmapItems.length === 0 ? (
        <div className="p-8 text-center text-xs text-gray-400">No feature roadmap items matching filter "{filterStatus}".</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {roadmapItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex gap-4 hover:border-gray-200 transition-all">
              {/* Interactive Upvote Box */}
              <button
                onClick={() => toggleUpvote(item.id)}
                className={`w-14 h-16 rounded-xl flex flex-col items-center justify-center border transition-all flex-shrink-0 ${
                  item.hasVoted
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/10'
                    : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 mb-1 ${item.hasVoted ? 'fill-current' : ''}`} />
                <span className="text-xs font-black">{item.upvoteCount ?? item.votes ?? 0}</span>
              </button>

              {/* Core Idea Copy Block */}
              <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 bg-gray-50 text-gray-500 border rounded-md">
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-bold ${
                      item.status === 'Released' ? 'text-emerald-600' : item.status === 'In Development' ? 'text-blue-600' : 'text-amber-600'
                    }`}>
                      ● {item.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 truncate pt-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.description || item.desc}</p>
                </div>

                {/* Social Interactions Strip */}
                <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 pt-1">
                  <button 
                    onClick={() => handleOpenComments(item)}
                    className="hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> {item.commentsCount ?? item.commentsCount ?? 0} Comments
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feature Request Comments Modal */}
      {activeFeature && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md w-full space-y-4 shadow-xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-xs font-bold text-gray-900 truncate">{activeFeature.title}</h3>
                <span className="text-[10px] text-gray-400">Discussion Thread</span>
              </div>
              <button onClick={() => setActiveFeature(null)} className="text-gray-400 hover:text-gray-700"><X className="w-4 h-4" /></button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {loadingComments ? (
                <p className="text-center text-gray-400 py-4">Loading discussion thread...</p>
              ) : commentsList.length === 0 ? (
                <p className="text-center text-gray-400 py-4">No comments on this feature request yet. Be the first to start the discussion!</p>
              ) : (
                commentsList.map((c: any, idx: number) => (
                  <div key={c.id || idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span className="font-bold text-gray-800">{c.sellerName || 'Seller'}</span>
                      <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recently'}</span>
                    </div>
                    <p className="text-gray-700 text-xs leading-relaxed">{c.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Share your thought or use case..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}