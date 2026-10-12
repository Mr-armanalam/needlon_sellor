'use client';


import { apiFetch } from "@/modules/auth/lib/auth-client";
import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Send, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface ChatPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyerId: string;
  customerName: string;
  onProceedToChat: () => void;
}

export default function ChatPermissionModal({
  isOpen,
  onClose,
  buyerId,
  customerName,
  onProceedToChat,
}: ChatPermissionModalProps) {
  const [permission, setPermission] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestMessage, setRequestMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !buyerId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    apiFetch(`/api/seller/chat/permission?buyerId=${buyerId}`)
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;
        if (json.success && json.data) {
          setPermission(json.data);
          if (json.data.canMessage) {
            onProceedToChat();
            onClose();
          }
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to check chat permissions');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, buyerId, onProceedToChat, onClose]);

  if (!isOpen) return null;

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const res = await apiFetch('/api/seller/chat/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId,
          message: requestMessage.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to send chat request');
      }

      setPermission({
        ...permission,
        status: 'REQUESTED',
        canMessage: false,
      });
    } catch (err: any) {
      setError(err.message || 'Error sending request');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Privacy Chat Permission Gate</h3>
              <p className="text-xs text-gray-500">Customer Direct Messaging Protocol</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {loading ? (
            <div className="py-8 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span>Verifying customer privacy authorization...</span>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
              {error}
            </div>
          ) : permission?.status === 'REQUESTED' ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Chat Request Pending</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                A chat request has already been sent to <span className="font-semibold text-gray-700">{customerName}</span>. In accordance with customer privacy rules, messaging will be unlocked once they accept the request in their Needlon account.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </div>
          ) : permission?.status === 'DECLINED' || permission?.isEnabled === false ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Chat Permission Restricted</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {customerName} has declined or disabled chat permissions for privacy protection. Sellers cannot initiate messages without customer consent.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendRequest} className="space-y-4">
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Privacy Protection Enabled
                </p>
                <p className="text-blue-700 leading-relaxed text-[11px]">
                  Needlon requires customers to grant explicit permission before an atelier or tailor shop can send direct messages. Send a connection request to begin chatting with {customerName}.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Request Message (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Hello! We would like to send you updates regarding your custom garment fitting."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {sending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <Send className="w-3.5 h-3.5" />
                  {sending ? 'Sending Request...' : 'Send Chat Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
