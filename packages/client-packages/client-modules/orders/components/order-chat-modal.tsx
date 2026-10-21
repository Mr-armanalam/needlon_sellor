"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  ShieldCheck,
  Send,
  Lock,
  Scissors,
  CheckCircle2,
  XCircle,
  Ban,
  Clock,
  RotateCcw,
} from "lucide-react";

/** One message in an order chat thread, as returned by GET /api/orders/[id]/chat. */
interface OrderChatMessage {
  id: string;
  senderType: string;
  content: string;
  createdAt: string;
}

/** Chat permission state for the order, as returned by the chat API. */
interface OrderChatPermissionState {
  status: string;
  canMessage: boolean;
  isEnabled: boolean;
  requestMessage?: string | null;
  lockReason?: string | null;
}

/** Payload of GET /api/orders/[id]/chat consumed by this modal. */
interface OrderChatData {
  conversationId?: string | null;
  orderNumber?: string;
  sellerName?: string;
  isDelivered?: boolean;
  permission?: OrderChatPermissionState;
  messages?: OrderChatMessage[];
}

interface OrderChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber?: string;
  itemName?: string;
  orderStatus?: string;
}

export default function OrderChatModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  itemName,
  orderStatus,
}: OrderChatModalProps) {
  const [loading, setLoading] = useState(false);
  const [chatData, setChatData] = useState<OrderChatData | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [permissionActing, setPermissionActing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChatDetails = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/chat`);
      const json = await res.json();
      if (json.success && json.data) {
        setChatData(json.data);
      }
    } catch (err) {
      console.error("Failed to load chat details:", err);
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

  const handleRespondPermission = async (
    action: "ACCEPT" | "DECLINE" | "BLOCK" | "UNBLOCK"
  ) => {
    setPermissionActing(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/chat/permission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchChatDetails();
      } else {
        alert(json.error || "Failed to update chat permission");
      }
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : "") || "Failed to respond to chat request");
    } finally {
      setPermissionActing(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const content = newMessage.trim();
    setNewMessage("");

    try {
      const res = await fetch(`/api/orders/${orderId}/chat`, {
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
      alert((err instanceof Error ? err.message : "") || "Failed to send message");
      setNewMessage(content);
    } finally {
      setSending(false);
    }
  };

  const isDelivered =
    chatData?.isDelivered ||
    orderStatus === "DELIVERED" ||
    orderStatus === "COMPLETED";

  const permission = chatData?.permission || {
    status: "NOT_REQUESTED",
    canMessage: false,
    isEnabled: true,
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl flex flex-col h-[600px] max-h-[90vh] bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center border border-blue-100 dark:border-blue-900">
              <Scissors className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>{chatData?.sellerName || "Needlon Atelier"}</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Verified Tailor
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                Order #{orderNumber || chatData?.orderNumber || orderId.slice(0, 8)}
                {itemName ? ` • ${itemName}` : ""}
              </DialogDescription>
            </div>
          </div>

          {/* Privacy Block / End Action */}
          {permission.status === "ACCEPTED" && !isDelivered && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRespondPermission("BLOCK")}
              disabled={permissionActing}
              className="text-xs h-7 px-2.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5 mr-1" />
              End Chat
            </Button>
          )}
          {permission.status === "BLOCKED" && !isDelivered && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRespondPermission("UNBLOCK")}
              disabled={permissionActing}
              className="text-xs h-7 px-2.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 border-blue-200 dark:border-blue-900/50 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Resume Chat
            </Button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/30 dark:bg-neutral-900/20">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-neutral-400">
              Connecting to secure atelier channel...
            </div>
          ) : (
            <>
              {/* Privacy Shield Notice */}
              <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-blue-900 dark:text-blue-200 leading-relaxed">
                  <span className="font-semibold">Privacy Protected:</span> This conversation is strictly scoped to this bespoke order and will automatically lock upon delivery. You can pause or end this chat at any time.
                </div>
              </div>

              {/* Status: NOT REQUESTED */}
              {permission.status === "NOT_REQUESTED" && (
                <div className="my-8 text-center p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    No Active Inquiry
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                    The atelier will initiate a chat request here if any fabric customization, measurement verification, or fitting details need your input.
                  </p>
                </div>
              )}

              {/* Status: REQUESTED */}
              {permission.status === "REQUESTED" && (
                <div className="my-4 p-4 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <MessageSquare className="w-4 h-4" />
                    <span>Atelier Chat Request</span>
                  </div>
                  <p className="text-xs text-amber-900 dark:text-amber-200 bg-white/70 dark:bg-black/30 p-3 rounded-xl border border-amber-200/50 dark:border-amber-900/40 italic">
                    "{permission.requestMessage || "Tailor requested to connect for order and fitting updates."}"
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400">
                    Accept this request to discuss your garment specifications directly with the tailor.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() => handleRespondPermission("ACCEPT")}
                      disabled={permissionActing}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Accept Chat Request
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRespondPermission("DECLINE")}
                      disabled={permissionActing}
                      className="text-xs font-medium rounded-xl border-neutral-300 dark:border-neutral-700 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              )}

              {/* Status: DECLINED */}
              {permission.status === "DECLINED" && (
                <div className="my-6 p-4 text-center bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    You declined the chat request for this order.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRespondPermission("ACCEPT")}
                    disabled={permissionActing}
                    className="text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Accept Now
                  </Button>
                </div>
              )}

              {/* Status: BLOCKED */}
              {permission.status === "BLOCKED" && (
                <div className="my-6 p-4 text-center bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-2">
                  <p className="text-xs font-medium text-rose-800 dark:text-rose-300">
                    You have ended/blocked chat for this order.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => handleRespondPermission("UNBLOCK")}
                    disabled={permissionActing}
                    className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    Unblock / Resume Chat
                  </Button>
                </div>
              )}

              {/* Message Feed */}
              {permission.status === "ACCEPTED" && (
                <div className="space-y-2.5 pt-2">
                  {(!chatData?.messages || chatData.messages.length === 0) ? (
                    <div className="text-center py-8 text-xs text-neutral-400 italic">
                      Chat session opened. Send a message to your master tailor below.
                    </div>
                  ) : (
                    chatData.messages.map((msg) => {
                      const isMe = msg.senderType === "BUYER";
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${
                            isMe ? "items-end" : "items-start"
                          }`}
                        >
                          <div className="text-[10px] text-neutral-400 mb-0.5 px-1 flex items-center gap-1">
                            <span>{isMe ? "You" : chatData.sellerName || "Atelier"}</span>
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
                                ? "bg-neutral-900 text-white dark:bg-blue-600 rounded-br-xs"
                                : "bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-bl-xs shadow-xs"
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
                <div className="my-3 p-3 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-neutral-500 shrink-0" />
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">
                    Order delivered/completed. This conversation is now closed for customer privacy.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Input Area */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          {isDelivered ? (
            <div className="text-center py-2 text-xs text-neutral-400 font-medium flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Chat locked after delivery</span>
            </div>
          ) : permission.status !== "ACCEPTED" ? (
            <div className="text-center py-2 text-xs text-neutral-400">
              {permission.status === "REQUESTED"
                ? "Please accept the chat request above to start messaging."
                : "Chat input unlocks once request is accepted."}
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message to the tailor..."
                className="rounded-xl text-xs bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus-visible:ring-1"
                disabled={sending}
              />
              <Button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-xl px-4 text-xs font-semibold shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                Send
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
