'use client';
import React, { useState } from 'react';
import { 
  MessageSquare, Mail, Phone, Ticket, 
  Calendar, User, ArrowLeft, Send, CheckCircle2, RefreshCw, X 
} from 'lucide-react';
import { useSupport } from '@/modules/help/hooks/use-support';
import { useHelpCenter } from '../hooks/use-help-center';

export default function SupportCenter({ onBack }: { onBack?: () => void }) {
  const { tickets, loading, createTicket, fetchTicketDetails, sendReply, updateStatus } = useSupport();
  const { requestCallback } = useHelpCenter();
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [ticketTimeline, setTicketTimeline] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newCategory, setNewCategory] = useState<any>('ORDER_ISSUE');
  const [newPriority, setNewPriority] = useState<any>('MEDIUM');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Callback modal state
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackTimeSlot, setCallbackTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [callbackReason, setCallbackReason] = useState('');

  const handleSelectTicket = async (ticket: any) => {
    const res = await fetchTicketDetails(ticket.id);
    if (res.success && res.data) {
      setActiveTicket(res.data);
      setTicketTimeline(res.data.timeline || []);
    } else {
      setActiveTicket(ticket);
      setTicketTimeline([
        { id: '1', senderType: 'system', senderName: 'Support Desk', message: ticket.message || 'Ticket created.', createdAt: ticket.createdAt }
      ]);
    }
  };

  const handleCreateNewTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;
    const res = await createTicket({
      subject: newSubject,
      category: newCategory,
      priority: newPriority,
      message: newMessage,
    });
    if (res.success) {
      alert("Support ticket created successfully!");
      setNewSubject('');
      setNewMessage('');
      setIsCreateModalOpen(false);
    } else {
      alert(res.error || "Failed to create ticket");
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    const res = await sendReply(activeTicket.id, replyText.trim());
    if (res.success) {
      const newMsgObj = res.data || {
        id: Date.now().toString(),
        senderType: 'seller',
        senderName: 'Seller',
        message: replyText.trim(),
        createdAt: new Date().toISOString()
      };
      setTicketTimeline(prev => [...prev, newMsgObj]);
      setReplyText("");
    } else {
      alert(res.error || "Failed to send reply");
    }
  };

  const toggleTicketStatus = async () => {
    if (!activeTicket) return;
    const nextStatus = activeTicket.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    const res = await updateStatus(activeTicket.id, nextStatus);
    if (res.success) {
      setActiveTicket({ ...activeTicket, status: nextStatus });
    } else {
      alert(res.error || "Failed to update ticket status");
    }
  };

  const handleScheduleCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone.trim()) return;
    const res = await requestCallback(callbackPhone, callbackTimeSlot, callbackReason);
    if (res.success) {
      alert("Callback request submitted successfully! Our support representative will contact you shortly.");
      setIsCallbackModalOpen(false);
      setCallbackPhone('');
      setCallbackReason('');
    } else {
      alert(res.error || "Failed to schedule callback");
    }
  };

  // 1. Detailed Ticket View & Conversation Timeline Layout
  if (activeTicket) {
    return (
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex flex-col h-full overflow-hidden animate-in fade-in duration-200">
        {/* Ticket Window Header */}
        <div className="p-4 border-b border-gray-50 flex items-center justify-between flex-shrink-0 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTicket(null)} className="text-gray-400 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-50"><ArrowLeft className="w-4 h-4" /></button>
            <div>
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                {activeTicket.ticketNumber || activeTicket.id}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTicket.status === 'OPEN' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>{activeTicket.status}</span>
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">{activeTicket.subject}</p>
            </div>
          </div>
          
          <button 
            onClick={toggleTicketStatus}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
              activeTicket.status === 'OPEN' 
                ? 'border-gray-200 text-gray-600 hover:bg-gray-50' 
                : 'border-blue-200 bg-blue-50 text-blue-600'
            }`}
          >
            {activeTicket.status === 'OPEN' ? (
              <><CheckCircle2 className="w-3.5 h-3.5 text-gray-400" /> Close Ticket</>
            ) : (
              <><RefreshCw className="w-3.5 h-3.5 text-blue-500" /> Reopen Ticket</>
            )}
          </button>
        </div>

        {/* Multi-Column View Workspace Framework */}
        <div className="flex-1 flex overflow-hidden min-h-0 flex-col lg:flex-row">
          
          {/* Conversation Timeline Log */}
          <div className="flex-1 flex flex-col min-h-0 border-b lg:border-b-0 lg:border-r border-gray-100 bg-slate-50">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {ticketTimeline.map((log: any, idx: number) => {
                const isSeller = log.senderType === 'seller';
                return (
                  <div key={log.id || idx} className={`flex flex-col max-w-[85%] space-y-1 ${isSeller ? 'ml-auto items-end' : ''}`}>
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isSeller ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    }`}>
                      {log.message || log.text}
                    </div>
                    <span className="text-[10px] text-gray-400 px-1">
                      {log.senderName ? `${log.senderName} • ` : ''}
                      {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (log.time || 'Just now')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Timeline Action Input Bar */}
            {activeTicket.status === 'OPEN' && (
              <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Respond to assigned support thread..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button type="submit" className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Ticket Metadata Control Column Sidebar */}
          <div className="w-full lg:w-64 p-4 space-y-4 text-xs bg-white overflow-y-auto flex-shrink-0 border-t lg:border-t-0 border-gray-100">
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
                <span className="font-semibold text-gray-900 flex items-center gap-1"><User className="w-3.5 h-3.5 text-gray-400" /> {activeTicket.assignedAgent || 'Support Desk'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Created:</span>
                <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-400" /> {new Date(activeTicket.createdAt).toLocaleDateString()}</span>
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
          <div 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-blue-200 transition-all group"
          >
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /></div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Live Support Desk</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Average wait: 2 mins</p>
            </div>
          </div>
          
          <div 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-purple-200 transition-all group"
          >
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors"><Mail className="w-4 h-4" /></div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Email Ticket</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Response within 12 hours</p>
            </div>
          </div>
          
          <div 
            onClick={() => setIsCallbackModalOpen(true)}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-emerald-200 transition-all group"
          >
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Phone className="w-4 h-4" /></div>
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
          <button onClick={() => setIsCreateModalOpen(true)} className="text-xs font-bold text-blue-600 hover:underline">Raise New Ticket</button>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400">Loading support tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">No support tickets created yet.</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {tickets.map((ticket: any) => (
              <div 
                key={ticket.id}
                onClick={() => handleSelectTicket(ticket)}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-all cursor-pointer text-xs font-medium"
              >
                <div className="space-y-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{ticket.subject}</p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-400">
                    <span className="font-semibold text-gray-700">{ticket.ticketNumber || ticket.id}</span>
                    <span>•</span>
                    <span>Category: {ticket.category}</span>
                    <span>•</span>
                    <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  ticket.priority === 'HIGH' || ticket.priority === 'URGENT' 
                    ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                    : 'bg-blue-50 text-blue-700 border border-blue-100'
                }`}>
                  {ticket.priority} Priority
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Raise New Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900">Raise Support Ticket</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-700"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handleCreateNewTicket} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-400 uppercase text-[10px]">Subject</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Issue with payout calculation"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-400 uppercase text-[10px]">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="ORDER_ISSUE">Order Issue</option>
                    <option value="PAYMENT_PAYOUT">Payment & Payout</option>
                    <option value="PRODUCT_CATALOG">Product Catalog</option>
                    <option value="ACCOUNT_SETTINGS">Account Settings</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-400 uppercase text-[10px]">Priority</label>
                  <select 
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-400 uppercase text-[10px]">Message Details</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Detail out your issue or question..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
                Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Callback Request Modal */}
      {isCallbackModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900">Request Callback</h3>
              <button onClick={() => setIsCallbackModalOpen(false)} className="text-gray-400 hover:text-gray-700"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handleScheduleCallback} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-400 uppercase text-[10px]">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+91 9876543210"
                  value={callbackPhone}
                  onChange={(e) => setCallbackPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-400 uppercase text-[10px]">Preferred Time Slot</label>
                <select 
                  value={callbackTimeSlot}
                  onChange={(e) => setCallbackTimeSlot(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 03:00 PM">12:00 PM - 03:00 PM</option>
                  <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-400 uppercase text-[10px]">Reason for Callback (Optional)</label>
                <textarea 
                  rows={2}
                  placeholder="Briefly state your topic..."
                  value={callbackReason}
                  onChange={(e) => setCallbackReason(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl hover:bg-emerald-700 transition-colors">
                Schedule Phone Call
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}