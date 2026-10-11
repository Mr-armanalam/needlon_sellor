"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, MessageSquare, Check, X, Store, Lock, Unlock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  getCustomerChatPermissions,
  respondChatPermissionAction,
  toggleChatPrivacyAction,
} from "../server/chat-privacy-controller";

export default function AtelierChatPermissions() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadPermissions = async () => {
    setLoading(true);
    const res = await getCustomerChatPermissions();
    if (res.success && res.data) {
      setPermissions(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  const handleRespond = async (sellerId: string, status: "ACCEPTED" | "DECLINED") => {
    setUpdatingId(sellerId);
    try {
      const res = await respondChatPermissionAction(sellerId, status);
      if (res.success) {
        toast.success(status === "ACCEPTED" ? "Chat request accepted!" : "Chat request declined.");
        await loadPermissions();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update permission");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggle = async (sellerId: string, currentEnabled: boolean) => {
    setUpdatingId(sellerId);
    try {
      const res = await toggleChatPrivacyAction(sellerId, !currentEnabled);
      if (res.success) {
        toast.success(!currentEnabled ? "Chat enabled for this atelier." : "Chat disabled for privacy.");
        await loadPermissions();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle privacy switch");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-stone-200/90 dark:border-neutral-800 text-xs text-stone-400 text-center flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-stone-500" />
        Loading atelier privacy permissions...
      </div>
    );
  }

  if (permissions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-stone-200/90 dark:border-neutral-800 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 dark:text-white">
              Atelier Messaging Privacy Controls
            </h2>
            <p className="text-xs text-stone-500 dark:text-neutral-400">
              Manage tailor shop direct message requests and toggle privacy settings.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {permissions.map((perm) => (
          <div
            key={perm.id}
            className="p-3.5 bg-stone-50/70 dark:bg-neutral-800/40 rounded-xl border border-stone-200/60 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-stone-500 dark:text-neutral-400" />
                <span className="text-xs font-bold text-stone-900 dark:text-white">
                  {perm.storeName || perm.sellerName || "Tailor Atelier"}
                </span>
                <span
                  className={`px-2 py-0.2 rounded-full text-[10px] font-semibold ${
                    perm.status === "ACCEPTED"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : perm.status === "REQUESTED"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                  }`}
                >
                  {perm.status}
                </span>
              </div>
              {perm.requestMessage && (
                <p className="text-xs text-stone-600 dark:text-neutral-300 italic">
                  &ldquo;{perm.requestMessage}&rdquo;
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {perm.status === "REQUESTED" ? (
                <>
                  <button
                    onClick={() => handleRespond(perm.sellerId, "ACCEPTED")}
                    disabled={updatingId === perm.sellerId}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespond(perm.sellerId, "DECLINED")}
                    disabled={updatingId === perm.sellerId}
                    className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-stone-700 dark:text-neutral-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    Decline
                  </button>
                </>
              ) : perm.status === "ACCEPTED" ? (
                <button
                  onClick={() => handleToggle(perm.sellerId, perm.isEnabled)}
                  disabled={updatingId === perm.sellerId}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    perm.isEnabled
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400"
                      : "bg-stone-100 border border-stone-200 text-stone-500 hover:bg-stone-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                  }`}
                >
                  {perm.isEnabled ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  {perm.isEnabled ? "Chat Enabled" : "Chat Disabled"}
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
