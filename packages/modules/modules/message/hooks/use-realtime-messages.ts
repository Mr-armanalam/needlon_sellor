import { useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";

export function useRealtimeMessages(conversationId?: string, onNewMessage?: (payload: any) => void) {
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
        (payload) => {
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
