"use client";
import React, { useEffect, useState } from "react";
import { Globe, Sun, Moon, Monitor, BellPlus, DollarSign, Send, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { SaveStatus } from "../view/seller-foundation-page";
import { useSellerSettingsForm } from "../hooks/use-seller-settings-form";
import { useNotifications } from "@/modules/shared/hooks/use-notifications";
import { SUPPORTED_LANGUAGES, SUPPORTED_CURRENCIES } from "@/modules/settings/hooks/use-seller-settings";

interface SellerSettingsProps {
  setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
}

type ThemeMode = "light" | "dark" | "system";

export default function SellerSettingsSection({
  setSaveStatus,
}: SellerSettingsProps) {
  const { theme: activeNextTheme, setTheme } = useTheme();
  const { refetch: refetchNavbarNotifications } = useNotifications();
  const [isSendingTest, setIsSendingTest] = useState(false);

  const {
    form,
    save,
    isSaving,
    isLoading,
    isError,
    error,
    isDirty,
    setField,
    toggleField,
  } = useSellerSettingsForm();

  useEffect(() => {
    setSaveStatus(isDirty ? "Changes pending" : "Saved ✓");
  }, [isDirty, setSaveStatus]);

  const handleSelectTheme = (modeId: ThemeMode) => {
    // 1. Immediately toggle real-time next-themes CSS class
    setTheme(modeId);
    // 2. Update form state to persist on save
    setField("theme", modeId.toUpperCase() as "LIGHT" | "DARK" | "SYSTEM");
  };

  const handleSendTestNotification = async () => {
    setIsSendingTest(true);
    try {
      const res = await fetch("/api/seller/settings/test-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Test Alert: Settings Synchronized",
          message: "Real-time preference synchronization between profile settings and top navbar is active.",
          type: "NEW_ORDER",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to trigger test notification");

      toast.success("Test notification delivered! Check the bell icon in the top navbar.");
      refetchNavbarNotifications();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Test notification failed");
    } finally {
      setIsSendingTest(false);
    }
  };

  if (isLoading || !form) {
    return (
      <div className="max-w-4xl rounded-2xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500 font-medium">Loading workspace settings...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-600 font-medium">
          {error instanceof Error ? error.message : "Unable to load settings."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* HEADER ROW */}
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold text-gray-900">
          Workspace Preferences
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Customize localization configurations, display themes, and notification rule engines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* BLOCK 1: LOCALIZATION AND REGION */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-gray-400" /> Regional Settings
          </h3>

          <div className="space-y-3 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Primary Language Dialect
              </label>
              <select
                value={form.languageCode}
                onChange={(e) => setField("languageCode", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Settlement Currency
              </label>
              <select
                value={form.currencyCode}
                onChange={(e) => setField("currencyCode", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {SUPPORTED_CURRENCIES.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {cur.code} - {cur.symbol} ({cur.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* BLOCK 2: VISUAL APPEARANCE DIALS (RADIO CARDS) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-gray-400" /> Interface Appearance
          </h3>

          <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
            {[
              {
                id: "light" as ThemeMode,
                label: "Light",
                icon: <Sun className="w-4 h-4" />,
              },
              {
                id: "dark" as ThemeMode,
                label: "Dark",
                icon: <Moon className="w-4 h-4" />,
              },
              {
                id: "system" as ThemeMode,
                label: "System",
                icon: <Monitor className="w-4 h-4" />,
              },
            ].map((mode) => {
              const isSelected =
                form.theme === mode.id.toUpperCase() ||
                (activeNextTheme === mode.id && !form.theme);

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => handleSelectTheme(mode.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/20 text-blue-600 shadow-xs"
                      : "border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {mode.icon}
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* BLOCK 3: NOTIFICATION MATRIX */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <BellPlus className="w-4 h-4 text-gray-400" /> Notification Channels
            </h3>
            <button
              type="button"
              disabled={isSendingTest}
              onClick={handleSendTestNotification}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              {isSendingTest ? "Sending Test..." : "Send Test Alert to Navbar"}
            </button>
          </div>

          <div className="divide-y divide-gray-50 border border-gray-50 rounded-xl overflow-hidden">
            {[
              {
                id: "emailNotifications" as const,
                title: "Email Order Dispatches",
                desc: "Receive instant email breakdown maps when checkouts finish successfully.",
              },
              {
                id: "smsNotifications" as const,
                title: "SMS Transaction Alerts",
                desc: "Get SMS text logs as soon as weekly revenue settles into your bank account.",
              },
              {
                id: "pushNotifications" as const,
                title: "Browser Push Alerts",
                desc: "Receive instant desktop push notifications for urgent marketplace updates.",
              },
              {
                id: "lowInventoryNotifications" as const,
                title: "Low Stock Notifications",
                desc: "Receive alert updates when product inventory drops below threshold parameters.",
              },
              {
                id: "payoutNotifications" as const,
                title: "Payout & Banking Logs",
                desc: "Receive automated alerts for withdrawal requests, bank approvals, and transfers.",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between gap-4 text-xs font-medium"
              >
                <div className="space-y-0.5">
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  <p className="text-[11px] text-gray-400 font-medium leading-normal">
                    {item.desc}
                  </p>
                </div>

                {/* IOS SWITCH SLIDER SCROLL ENGINE */}
                <button
                  type="button"
                  onClick={() => toggleField(item.id)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex-shrink-0 cursor-pointer ${
                    form[item.id] ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transform duration-200 ease-in-out ${
                      form[item.id] ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={async () => {
                await save();
                toast.success("Preferences updated successfully!");
              }}
              disabled={isSaving}
              className={`${
                isSaving ? "bg-blue-100" : "bg-blue-600 hover:bg-blue-700"
              } text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-all shadow-blue-600/10 cursor-pointer`}
            >
              {isSaving ? "Configuring..." : "Apply Configurations"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


