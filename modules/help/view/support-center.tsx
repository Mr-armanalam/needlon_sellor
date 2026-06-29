import React, { useState } from 'react';
import { 
  MessageSquare, Mail, Phone, Ticket, ShieldAlert, 
  Calendar, User, ArrowLeft, Send, CheckCircle2, RefreshCw 
} from 'lucide-react';

const mockTickets = [
  {
    id: 'TCK-4081',
    status: 'Open',
    priority: 'High',
    category: 'Payment Settlements',
    createdDate: 'June 28, 2026',
    updatedDate: 'June 29, 2026',
    assignedAgent: 'Vikram Sharma',
    subject: 'Delay in weekly payout reconciliation',
    timeline: [
      { id: 1, type: 'system', text: 'Ticket opened by Arman Alam', time: 'June 28, 10:00 AM' },
      { id: 2, type: 'agent', text: 'Hello Arman, our clearing house is completing a system audit. Payout logs will sync shortly.', time: 'June 28, 02:15 PM' }
    ]
  }
];

export default function SupportCenter({ onBack }) {
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Handle local timeline replies
  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    const newReply = {
      id: Date.now(),
      type: 'user',
      text: replyText,
      time: 'Just now'
    };
    
    setActiveTicket({
      ...activeTicket,
      timeline: [...activeTicket.timeline, newReply],
      updatedDate: 'Just now'
    });
    setReplyText('');
  };

  const toggleTicketStatus = () => {
    const nextStatus = activeTicket.status === 'Open' ? 'Closed' : 'Open';
    setActiveTicket({ ...activeTicket, status: nextStatus });
  };

  // 1. Detailed Ticket View & Conversation Timeline Layout
  if (activeTicket) {
    return (
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex flex-col h-full overflow-hidden animate-in fade-in duration-200">
        {/* Ticket Window Header */}
        <div className="p-4 border-b border-gray-50 flex items-center justify-between flex-shrink-0 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTicket(null)} className="text-gray-400 hover:text-gray-900"><ArrowLeft className="w-4 h-4" /></button>
            <div>
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                {activeTicket.id}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTicket.status === 'Open' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>{activeTicket.status}</span>
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">{activeTicket.subject}</p>
            </div>
          </div>
          
          <button 
            onClick={toggleTicketStatus}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
              activeTicket.status === 'Open' 
                ? 'border-gray-200 text-gray-600 hover:bg-gray-50' 
                : 'border-blue-200 bg-blue-50 text-blue-600'
            }`}
          >
            {activeTicket.status === 'Open' ? (
              <>规律<CheckCircle2 className="w-3.5 h-3.5 text-gray-400" /> Close Ticket</>
            ) : (
              <>规律<RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Reopen Ticket</>
            )}
          </button>
        </div>

        {/* Multi-Column View Workspace Framework */}
        <div className="flex-1 flex overflow-hidden min-h-0 flex-col lg:flex-row">
          
          {/* Conversation Timeline Log */}
          <div className="flex-1 flex flex-col min-h-0 border-b lg:border-b-0 lg:border-r border-gray-100 bg-slate-50">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTicket.timeline.map((log) => (
                <div key={log.id} className={`flex flex-col max-w-[85%] space-y-1 ${log.type === 'user' ? 'ml-auto items-end' : ''}`}>
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    log.type === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'
                  }`}>
                    {log.text}
                  </div>
                  <span className="text-[10px] text-gray-400 px-1">{log.time}</span>
                </div>
              ))}
            </div>

            {/* Timeline Action Input Bar */}
            {activeTicket.status === 'Open' && (
              <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Respond to assigned agent support thread..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button type="submit" className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Ticket Metadata Control Column Sidebar */}
          <div className="w-full lg:w-64 p-4 space-y-4 text-xs bg-white overflow-y-auto flex-shrink-0">
            <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Ticket Parameters</h4>
            <div className="space-y-3 font-medium text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span className="font-semibold text-gray-900">{activeTicket.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Priority Tier:</span>
                <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">{activeTicket.priority}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Agent:</span>
                <span className="font-semibold text-gray-900 flex items-center gap-1"><User className="w-3.5 h-3.5 text-gray-400" /> {activeTicket.assignedAgent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Created:</span>
                <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-400" /> {activeTicket.createdDate}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex-1 overflow-y-auto pr-1 min-h-0 animate-in fade-in duration-200">
      
      {/* 2. Multiple Channels Selection Layout Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Direct Support Channels</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-gray-200 transition-all">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><MessageSquare className="w-4 h-4" /></div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Live Chat Help</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Average wait: 2 mins</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-gray-200 transition-all">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Mail className="w-4 h-4" /></div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Email Support</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Response within 12 hours</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-gray-200 transition-all">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Phone className="w-4 h-4" /></div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Request Callback</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Available 9 AM - 6 PM</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 cursor-not-allowed opacity-50 border-dashed">
            <div className="p-2 bg-gray-50 text-gray-400 rounded-xl"><MessageSquare className="w-4 h-4" /></div>
            <div>
              <h4 className="text-xs font-bold text-gray-400">WhatsApp Help</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Operational Active Ticket Summary Feed List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5"><Ticket className="w-4 h-4" /> Your Support Tickets</h3>
          <button className="text-xs font-bold text-blue-600 hover:underline">Raise New Ticket</button>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          {mockTickets.map((ticket) => (
            <div 
              key={ticket.id}
              onClick={() => setActiveTicket(ticket)}
              className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-all cursor-pointer text-xs font-medium"
            >
              <div className="space-y-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{ticket.subject}</p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-400">
                  <span className="font-semibold text-gray-700">{ticket.id}</span>
                  <span>•</span>
                  <span>Category: {ticket.category}</span>
                  <span>•</span>
                  <span>Updated: {ticket.updatedDate}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 flex-shrink-0">
                {ticket.priority} Priority
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}