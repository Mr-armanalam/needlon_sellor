import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Plus, Layers, Flame, CheckCircle2 } from 'lucide-react';

const mockRoadmapItems = [
  {
    id: 501,
    title: "Bulk Inventory CSV Upload Tool",
    desc: "Allow sellers to update over 100 stock allocations simultaneously via file spreadsheet dropping.",
    category: "Product Management",
    status: "In Development",
    votes: 142,
    hasVoted: false,
    commentsCount: 24
  },
  {
    id: 502,
    title: "Automated WhatsApp Abandoned Cart Reminders",
    desc: "Send automated notification recovery lines when clients leave custom configurations unpaid.",
    category: "Marketing Push",
    status: "Planned",
    votes: 89,
    hasVoted: true,
    commentsCount: 11
  },
  {
    id: 503,
    title: "Dark Mode Interface Layout Theme",
    desc: "Complete dark palette stylesheet transformation across the admin panel dashboard grid framework.",
    category: "UI Improvement",
    status: "Released",
    votes: 310,
    hasVoted: false,
    commentsCount: 45
  }
];

export default function FeedbackRoadmap({ onCreateFeedbackClick }) {
  const [items, setItems] = useState(mockRoadmapItems);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleVoteToggle = (id) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          votes: item.hasVoted ? item.votes - 1 : item.votes + 1,
          hasVoted: !item.hasVoted
        };
      }
      return item;
    }));
  };

  const filteredItems = filterStatus === 'all' 
    ? items 
    : items.filter(i => i.status.toLowerCase().replace(" ", "-") === filterStatus);

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
              onClick={() => setFilterStatus(tab.id)}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex gap-4 hover:border-gray-200 transition-all">
            {/* Interactive Upvote Box */}
            <button
              onClick={() => handleVoteToggle(item.id)}
              className={`w-14 h-16 rounded-xl flex flex-col items-center justify-center border transition-all flex-shrink-0 ${
                item.hasVoted
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/10'
                  : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 mb-1 ${item.hasVoted ? 'fill-current' : ''}`} />
              <span className="text-xs font-black">{item.votes}</span>
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
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.desc}</p>
              </div>

              {/* Social Interactions Strip */}
              <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 pt-1">
                <button className="hover:text-gray-600 flex items-center gap-1.5 transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" /> {item.commentsCount} Comments
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}