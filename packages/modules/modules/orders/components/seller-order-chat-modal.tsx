"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  ShieldCheck,
  Send,
  Lock,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  XCircle,
  Ban,
} from "lucide-react";
import { apiFetch } from "@/modules/auth/lib/auth-client";
import type { OrderChatState } from "@/modules/orders/repositery/order-chat.repository";

interface SellerOrderChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber?: string;
  buyerName?: string;
}

export default function SellerOrderChatModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  buyerName,
}: SellerOrderChatModalProps) {
  const [loading, setLoading] = useState(false);
  const [chatData, setChatData] = useState<OrderChatState | null>(null);
  const [requestNote, setRequestNote] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChatDetails = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const res = await apiFetch(`/api/seller/orders/${orderId}/chat`);
      const json = await res.json();
      if (json.success && json.data) {
        setChatData(json.data);
      }
    } catch (err) {
      console.error("Failed to load seller order chat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchChatDetails();
    }
  }, [isOpen, orderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData?.messages]);

  const handleSendChatRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequesting(true);
    try {
      const res = await apiFetch(`/api/seller/orders/${orderId}/chat/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: requestNote }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchChatDetails();
        setRequestNote("");
      } else {
        alert(json.error || "Failed to send chat request");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to send chat request");
    } finally {
      setRequesting(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const content = newMessage.trim();
    setNewMessage("");

    try {
      const res = await apiFetch(`/api/seller/orders/${orderId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchChatDetails();
      } else {
        alert(json.error || "Failed to send message");
        setNewMessage(content);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to send message");
      setNewMessage(content);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const isDelivered = Boolean(chatData?.isDelivered);
  const permission: OrderChatState["permission"] = chatData?.permission || {
    status: "NOT_REQUESTED",
    canMessage: false,
    isEnabled: true,
    requestMessage: null,
    lockReason: "NOT_ACCEPTED",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-neutral-100 flex flex-col h-[600px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <span>{chatData?.buyerName || buyerName || "Customer"}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Buyer
                </span>
              </h3>
              <p className="text-xs text-neutral-500">
                Order #{orderNumber || chatData?.orderNumber || orderId.slice(0, 8)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-200/60 flex items-center justify-center text-neutral-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/40">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-neutral-400">
              Loading chat channel...
            </div>
          ) : (
            <>
              {/* Privacy Shield Notice */}
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-blue-900 leading-relaxed">
                  <span className="font-semibold">Privacy Compliance:</span> Direct buyer communication requires buyer acceptance. Conversation automatically locks after order delivery.
                </div>
              </div>

              {/* Status: NOT REQUESTED */}
              {permission.status === "NOT_REQUESTED" && (
                <div className="my-4 p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                  <div className="text-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-800">
                      Request Chat Permission
                    </h4>
                    <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                      Send a message request to the buyer explaining what details or fitting clarifications you require.
                    </p>
                  </div>

                  <form onSubmit={handleSendChatRequest} className="space-y-3">
                    <textarea
                      rows={3}
                      value={requestNote}
                      onChange={(e) => setRequestNote(e.target.value)}
                      placeholder="e.g. Hello, we noticed your garment measurements might need a sleeve length verification..."
                      className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none bg-neutral-50"
                    />
                    <button
                      type="submit"
                      disabled={requesting}
                      className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-60"
                    >
                      {requesting ? "Sending Request..." : "Send Chat Request to Buyer"}
                    </button>
                  </form>
                </div>
              )}

              {/* Status: REQUESTED */}
              {permission.status === "REQUESTED" && (
                <div className="my-4 p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Chat Request Pending Buyer Approval</span>
                  </div>
                  <p className="text-xs text-amber-900 bg-white/80 p-3 rounded-xl border border-amber-200/60 italic">
                    "{permission.requestMessage || "Inquiry sent to buyer."}"
                  </p>
                  <p className="text-[11px] text-amber-700">
                    The customer has received your request on their order details page. Messaging will unlock as soon as they accept.
                  </p>
                </div>
              )}

              {/* Status: DECLINED */}
              {permission.status === "DECLINED" && (
                <div className="my-4 p-5 text-center bg-neutral-100 rounded-2xl border border-neutral-200 space-y-2">
                  <XCircle className="w-6 h-6 text-neutral-500 mx-auto" />
                  <p className="text-xs font-medium text-neutral-700">
                    The buyer declined the chat request for this order.
                  </p>
                </div>
              )}

              {/* Status: BLOCKED */}
              {permission.status === "BLOCKED" && (
                <div className="my-4 p-5 text-center bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                  <Ban className="w-6 h-6 text-rose-500 mx-auto" />
                  <p className="text-xs font-medium text-rose-800">
                    The buyer has ended or blocked communication for this order.
                  </p>
                </div>
              )}

              {/* Message Feed */}
              {permission.status === "ACCEPTED" && (
                <div className="space-y-2.5 pt-2">
                  {(!chatData?.messages || chatData.messages.length === 0) ? (
                    <div className="text-center py-8 text-xs text-neutral-400 italic">
                      Chat permission accepted by buyer. Send your message below.
                    </div>
                  ) : (
                    chatData.messages.map((msg) => {
                      const isMe = msg.senderType === "SELLER";
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${
                            isMe ? "items-end" : "items-start"
                          }`}
                        >
                          <div className="text-[10px] text-neutral-400 mb-0.5 px-1 flex items-center gap-1">
                            <span>{isMe ? "You (Tailor)" : chatData.buyerName || "Buyer"}</span>
                            <span>•</span>
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div
                            className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                              isMe
                                ? "bg-neutral-900 text-white rounded-br-xs"
                                : "bg-white text-neutral-800 border border-neutral-200 rounded-bl-xs shadow-xs"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Delivery Locked Banner */}
              {isDelivered && (
                <div className="my-3 p-3 bg-neutral-100 rounded-xl border border-neutral-200 flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-neutral-500 shrink-0" />
                  <p className="text-[11px] text-neutral-600 font-medium">
                    Order is delivered/completed. Conversation has been closed for customer privacy.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Input Area */}
        <div className="p-3 border-t border-neutral-100 bg-white">
          {isDelivered ? (
            <div className="text-center py-2 text-xs text-neutral-400 font-medium flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Chat locked after delivery</span>
            </div>
          ) : permission.status !== "ACCEPTED" ? (
            <div className="text-center py-2 text-xs text-neutral-400">
              {permission.status === "REQUESTED"
                ? "Waiting for buyer to accept chat request."
                : "Chat input unlocks once permission is accepted."}
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message to the customer..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl px-4 py-2.5 text-xs font-semibold shrink-0 cursor-pointer disabled:opacity-50 flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
