"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { adminApi } from "../admin-api";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

interface TicketLastMessage {
  message: string;
  senderType: string;
  senderName: string;
  createdAt: string;
}

interface SupportTicketRow {
  id: string;
  ticketNumber: string;
  sellerId: string;
  sellerName: string;
  storeName: string | null;
  subject: string;
  category: string;
  priority: string;
  status: string;
  assignedAgent: string;
  message: string;
  messageCount: number;
  lastMessage: TicketLastMessage | null;
  createdAt: string;
  updatedAt: string;
}

interface SupportMessage {
  id: string;
  ticketId: string;
  senderType: string;
  senderName: string;
  message: string;
  createdAt: string;
}

interface SupportThread {
  ticket: SupportTicketRow;
  messages: SupportMessage[];
}

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "ALL", label: "All statuses" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400";
const labelClass = "block text-xs font-medium text-gray-500 mb-1";

function statusBadgeClass(status: string): string {
  switch (status) {
    case "OPEN":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "RESOLVED":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

export default function SupportInbox() {
  const [tickets, setTickets] = useState<SupportTicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [thread, setThread] = useState<SupportThread | null>(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const reload = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      const query = params.toString();
      const data = await adminApi<{ tickets: SupportTicketRow[] }>(
        `/api/admin/support/tickets${query ? `?${query}` : ""}`,
      );
      setTickets(data.tickets);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void reload();
    }, 250);
    return () => clearTimeout(timer);
  }, [reload]);

  const openTicket = async (ticketId: string) => {
    setThreadLoading(true);
    setError(null);
    try {
      const data = await adminApi<SupportThread>(
        `/api/admin/support/tickets/${ticketId}`,
      );
      setThread(data);
      setReplyText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ticket");
    } finally {
      setThreadLoading(false);
    }
  };

  const sendReply = async (event: FormEvent) => {
    event.preventDefault();
    if (!thread || !replyText.trim()) return;
    setSending(true);
    setError(null);
    try {
      const data = await adminApi<SupportThread>(
        `/api/admin/support/tickets/${thread.ticket.id}/reply`,
        {
          method: "POST",
          body: JSON.stringify({ message: replyText.trim() }),
        },
      );
      setThread(data);
      setReplyText("");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const changeStatus = async (status: TicketStatus) => {
    if (!thread) return;
    setError(null);
    try {
      const data = await adminApi<{ ticket: SupportTicketRow }>(
        `/api/admin/support/tickets/${thread.ticket.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      );
      setThread({ ...thread, ticket: data.ticket });
      await reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update status",
      );
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr]">
        {/* Ticket list pane */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="space-y-3 border-b border-gray-100 p-4">
            <div>
              <label className={labelClass}>Status</label>
              <select
                className={inputClass}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Search</label>
              <input
                className={inputClass}
                placeholder="Subject, ticket number or seller…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-[640px] divide-y divide-gray-50 overflow-y-auto">
            {loading ? (
              <p className="p-5 text-sm text-gray-400">Loading tickets…</p>
            ) : tickets.length === 0 ? (
              <p className="p-5 text-sm text-gray-400">
                No tickets match this filter.
              </p>
            ) : (
              tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => void openTicket(ticket.id)}
                  className={`block w-full px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                    thread?.ticket.id === ticket.id ? "bg-slate-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {ticket.subject}
                    </p>
                    <span
                      className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusBadgeClass(ticket.status)}`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {ticket.sellerName}
                    {ticket.storeName ? ` · ${ticket.storeName}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {ticket.ticketNumber} · {ticket.priority} ·{" "}
                    {ticket.messageCount}{" "}
                    {ticket.messageCount === 1 ? "message" : "messages"}
                  </p>
                  {ticket.lastMessage && (
                    <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                      <span className="font-medium text-gray-500">
                        {ticket.lastMessage.senderName}:
                      </span>{" "}
                      {ticket.lastMessage.message}
                    </p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Thread pane */}
        <div className="flex min-h-[480px] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {threadLoading ? (
            <p className="p-5 text-sm text-gray-400">Loading conversation…</p>
          ) : !thread ? (
            <p className="p-5 text-sm text-gray-400">
              Select a ticket to read the conversation and reply as support.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 p-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    {thread.ticket.subject}
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {thread.ticket.ticketNumber} · {thread.ticket.sellerName}
                    {thread.ticket.storeName
                      ? ` · ${thread.ticket.storeName}`
                      : ""}{" "}
                    · Category: {thread.ticket.category} · Priority:{" "}
                    {thread.ticket.priority} · Agent:{" "}
                    {thread.ticket.assignedAgent}
                  </p>
                </div>
                <div className="w-44">
                  <label className={labelClass}>Status</label>
                  <select
                    className={inputClass}
                    value={thread.ticket.status}
                    onChange={(e) =>
                      void changeStatus(e.target.value as TicketStatus)
                    }
                  >
                    {STATUS_OPTIONS.filter((o) => o.value !== "ALL").map(
                      (option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
                {thread.messages.map((msg) => {
                  const isSeller = msg.senderType === "seller";
                  return (
                    <div
                      key={msg.id}
                      className={`flex max-w-[85%] flex-col space-y-1 ${
                        isSeller ? "" : "ml-auto items-end"
                      }`}
                    >
                      <div
                        className={`rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                          isSeller
                            ? "rounded-tl-none border border-gray-100 bg-white text-gray-800"
                            : "rounded-tr-none bg-gray-900 text-white"
                        }`}
                      >
                        {msg.message}
                      </div>
                      <span className="px-1 text-[10px] text-gray-400">
                        {msg.senderName} · {msg.senderType} ·{" "}
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <form
                onSubmit={sendReply}
                className="flex gap-2 border-t border-gray-100 p-3"
              >
                <input
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
                  placeholder="Reply as support agent…"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {sending ? "Sending…" : "Reply"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
