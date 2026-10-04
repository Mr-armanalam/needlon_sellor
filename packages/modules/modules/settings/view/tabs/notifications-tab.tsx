"use client";

import React, { useState } from "react";
import { 
  Bell, Mail, MessageSquare, Smartphone, ShoppingBag, 
  AlertTriangle, DollarSign, Tag, Send, CheckCircle2 
} from "lucide-react";
import { useSellerSettings } from "../../hooks/use-seller-settings";
import { useNotifications } from "@/modules/shared/hooks/use-notifications";
import { toast } from "sonner";

export default function NotificationsTab() {
  const { settings, updateSettings, isUpdating } = useSellerSettings();
  const { refetch: refetchNavbarNotifications } = useNotifications();
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleToggle = async (key: string, currentValue: boolean) => {
    await updateSettings({ [key]: !currentValue });
  };

  const handleSendTestNotification = async () => {
    setIsSendingTest(true);
    try {
      const res = await fetch("/api/seller/settings/test-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Test Alert: Order Pipeline Verified",
          message: "Real-time notification synchronization between settings and top navbar is active.",
          type: "NEW_ORDER",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to trigger test notification");

      toast.success("Test notification delivered! Check the bell icon in your top navbar.");
      // Instantly refresh navbar notification feed & unread badge
      refetchNavbarNotifications();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Test notification failed");
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleRequestPushPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        toast.success("Browser push notifications authorized!");
        await updateSettings({ pushNotifications: true });
      } else {
        toast.error("Push notification permission denied in browser settings.");
      }
    } else {
      toast.error("Browser does not support desktop notifications.");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-neutral-800 pb-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Notification Channels & Alert Matrices
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Control delivery channels and filter triggers for orders, inventory, payouts, and buyer chats.
            </p>
          </div>
          {isUpdating && (
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 animate-pulse bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
              Saving preferences...
            </span>
          )}
        </div>
      </div>

      {/* 1. Delivery Channels Card */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xs font-bold text-gray-900 dark:text-white">
            Authorized Communication Channels
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Select the pathways through which Needlon dispatches critical account updates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Email */}
          <div className="p-4 rounded-2xl border border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="checkbox"
                checked={settings?.emailNotifications ?? true}
                onChange={() => handleToggle("emailNotifications", settings?.emailNotifications ?? true)}
                disabled={isUpdating}
                className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">Email Digest</div>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Receipts, settlement summaries, and system security alerts.
              </p>
            </div>
          </div>

          {/* SMS */}
          <div className="p-4 rounded-2xl border border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <input
                type="checkbox"
                checked={settings?.smsNotifications ?? true}
                onChange={() => handleToggle("smsNotifications", settings?.smsNotifications ?? true)}
                disabled={isUpdating}
                className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">SMS Express</div>
              <p className="text-[10px] text-gray-400 mt-0.5">
                High-priority order escalations and two-factor verifications.
              </p>
            </div>
          </div>

          {/* Browser Push */}
          <div className="p-4 rounded-2xl border border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                <Bell className="w-4 h-4" />
              </div>
              <input
                type="checkbox"
                checked={settings?.pushNotifications ?? true}
                onChange={() => {
                  if (!settings?.pushNotifications) {
                    handleRequestPushPermission();
                  } else {
                    handleToggle("pushNotifications", true);
                  }
                }}
                disabled={isUpdating}
                className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">Browser Push</div>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Real-time chime when a new customer checkout lands.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Event Triggers Matrix */}
      <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
        <div>
          <h3 className="text-xs font-bold text-gray-900 dark:text-white">
            Operational Event Triggers
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Define specific marketplace scenarios that require real-time alerts.
          </p>
        </div>

        <div className="space-y-2">
          {/* Order Notifications */}
          <div className="p-3.5 rounded-xl border border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">New Order Checkouts</div>
                <div className="text-[10px] text-gray-400">Triggered whenever a buyer completes checkout.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.orderNotifications ?? true}
              onChange={() => handleToggle("orderNotifications", settings?.orderNotifications ?? true)}
              disabled={isUpdating}
              className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Low Stock Notifications */}
          <div className="p-3.5 rounded-xl border border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">Low Inventory Thresholds</div>
                <div className="text-[10px] text-gray-400">Alerts when variant stock levels dip below buffer thresholds.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.lowInventoryNotifications ?? true}
              onChange={() => handleToggle("lowInventoryNotifications", settings?.lowInventoryNotifications ?? true)}
              disabled={isUpdating}
              className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Payout Notifications */}
          <div className="p-3.5 rounded-xl border border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">Payout & Settlement Dispatches</div>
                <div className="text-[10px] text-gray-400">Notifies when weekly revenue balances transfer to your bank.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.payoutNotifications ?? true}
              onChange={() => handleToggle("payoutNotifications", settings?.payoutNotifications ?? true)}
              disabled={isUpdating}
              className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Marketing Notifications */}
          <div className="p-3.5 rounded-xl border border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">Marketing & Growth Opportunities</div>
                <div className="text-[10px] text-gray-400">Insights regarding seasonal promotions and customer segments.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings?.marketingNotifications ?? false}
              onChange={() => handleToggle("marketingNotifications", settings?.marketingNotifications ?? false)}
              disabled={isUpdating}
              className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Live Pipeline Verification */}
      <div className="p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/10 flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Validate Real-Time Pipeline
          </div>
          <p className="text-[11px] text-blue-700 dark:text-blue-300">
            Send an instant test notification to verify your top navbar bell badge.
          </p>
        </div>
        <button
          onClick={handleSendTestNotification}
          disabled={isSendingTest}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          {isSendingTest ? "Sending..." : "Send Test Notification"}
        </button>
      </div>
    </div>
  );
}
