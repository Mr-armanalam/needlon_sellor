"use client";

import { Check, X, MessageSquare, Loader2 } from "lucide-react";

interface MetaValueQuickActionProps {
  orderId?: string;
  status?: string;
  onAccept?: (orderId: string) => void;
  onDecline?: (orderId: string) => void;
  onChat?: (orderId: string) => void;
  isLoading?: boolean;
}

const MetaValueQuickAction = ({
  orderId,
  status = "PENDING",
  onAccept,
  onDecline,
  onChat,
  isLoading = false,
}: MetaValueQuickActionProps) => {
  const isPending = status === "PENDING";

  return (
    <div className="flex items-center gap-1.5">
      {/* Chat Action */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (orderId && onChat) onChat(orderId);
        }}
        title="Chat with Customer"
        className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-200 cursor-pointer"
      >
        <MessageSquare size={16} />
      </button>

      {/* Reject Action */}
      {isPending && (
        <button
          type="button"
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            if (orderId && onDecline) onDecline(orderId);
          }}
          title="Decline Order"
          className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50/60 transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin text-neutral-400" /> : <X size={16} />}
        </button>
      )}

      {/* Accept Primary Action */}
      {isPending ? (
        <button
          type="button"
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            if (orderId && onAccept) onAccept(orderId);
          }}
          title="Accept Order"
          className="p-2 rounded-xl text-neutral-900 hover:text-white hover:bg-neutral-900 border border-neutral-200/80 hover:border-transparent transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-neutral-900" />
          ) : (
            <Check size={16} strokeWidth={2.5} />
          )}
        </button>
      ) : (
        <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
          {status}
        </span>
      )}
    </div>
  );
};

export default MetaValueQuickAction;

