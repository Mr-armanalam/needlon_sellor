import { useState, useEffect, useCallback } from "react";
import { SupportTicketResponseDto, CreateSupportTicketDto } from "../dto/support.dto";

export function useSupport() {
  const [tickets, setTickets] = useState<SupportTicketResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/seller/support/tickets");
      const json = await res.json();
      if (json.success && json.data) {
        setTickets(json.data.tickets || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const createTicket = async (dto: CreateSupportTicketDto) => {
    try {
      const res = await fetch("/api/seller/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });
      const json = await res.json();
      if (json.success) {
        await fetchTickets();
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error?.message || "Failed to create support ticket" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const fetchTicketDetails = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/seller/support/tickets/${ticketId}`);
      const json = await res.json();
      if (json.success) {
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error?.message || "Failed to load ticket details" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const sendReply = async (ticketId: string, message: string) => {
    try {
      const res = await fetch(`/api/seller/support/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchTickets();
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error?.message || "Failed to send reply" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateStatus = async (ticketId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") => {
    try {
      const res = await fetch(`/api/seller/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchTickets();
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error?.message || "Failed to update ticket status" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    tickets,
    loading,
    error,
    refetch: fetchTickets,
    createTicket,
    fetchTicketDetails,
    sendReply,
    updateStatus,
  };
}
