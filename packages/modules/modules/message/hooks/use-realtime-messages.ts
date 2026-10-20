import { useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { messagesTable } from "@/db/schema/messages";

/**
 * Row inserted into the messages table, as delivered in the
 * `new` record of a Supabase postgres_changes INSERT payload.
 */
export type RealtimeMessageRow = typeof messagesTable.$inferSelect;

interface RealtimeMessageInsertPayload {
  new: RealtimeMessageRow;
}

export function useRealtimeMessages(conversationId?: string, onNewMessage?: (payload: RealtimeMessageRow) => void) {
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabaseClient
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: RealtimeMessageInsertPayload) => {
          if (onNewMessage) {
            onNewMessage(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [conversationId, onNewMessage]);
}
