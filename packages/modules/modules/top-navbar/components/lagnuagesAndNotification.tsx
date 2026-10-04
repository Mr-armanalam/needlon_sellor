'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Bell, Globe, CheckCheck, Package, MessageSquare, 
  Settings as SettingsIcon, Check, DollarSign 
} from "lucide-react";
import { useNotifications } from "@/modules/shared/hooks/use-notifications";
import { 
  useSellerSettings, 
  SUPPORTED_LANGUAGES, 
  SUPPORTED_CURRENCIES 
} from "@/modules/settings/hooks/use-seller-settings";

const LagnuagesAndNotification = () => {
  const { notifications, unreadCount, markRead } = useNotifications();
  const { settings, updateSettings, isUpdating } = useSellerSettings();
  
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const notifyRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifyRef.current && !notifyRef.current.contains(event.target as Node)) {
        setIsNotifyOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = SUPPORTED_LANGUAGES.find(
    (l) => l.code === (settings?.languageCode || "en")
  ) || SUPPORTED_LANGUAGES[0];

  const currentCurrency = SUPPORTED_CURRENCIES.find(
    (c) => c.code === (settings?.currencyCode || "INR")
  ) || SUPPORTED_CURRENCIES[0];

  const handleLanguageChange = async (langCode: string) => {
    try {
      await updateSettings({ languageCode: langCode });
      setIsLangOpen(false);
    } catch {
      // toast is already handled in hook
    }
  };

  const handleCurrencyChange = async (currCode: string) => {
    try {
      await updateSettings({ currencyCode: currCode });
      setIsLangOpen(false);
    } catch {
      // toast is already handled in hook
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      {/* 1. Language Selector Button & Dropdown */}
      <div className="relative" ref={langRef}>
        <button
          onClick={() => {
            setIsLangOpen(!isLangOpen);
            setIsNotifyOpen(false);
          }}
          className={`px-2.5 py-1.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer border ${
            isLangOpen ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20" : "border-transparent"
          }`}
          title="Select Language & Currency"
          id="navbar-language-btn"
        >
          <span className="text-sm">{currentLang.flag}</span>
          <span className="hidden sm:inline uppercase text-[11px] font-bold text-neutral-700 dark:text-neutral-200">
            {currentLang.code}
          </span>
          <span className="text-neutral-400 text-[10px] hidden md:inline">| {currentCurrency.symbol}</span>
        </button>

        {isLangOpen && (
          <div className="absolute right-0 top-11 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl z-50 p-3.5 flex flex-col gap-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Globe size={14} className="text-blue-600 dark:text-blue-400" />
                Language & Region
              </span>
              <Link
                href="/settings?tab=language"
                onClick={() => setIsLangOpen(false)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
              >
                More <SettingsIcon size={11} />
              </Link>
            </div>

            {/* Language Selection List */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Display Language
              </p>
              <div className="max-h-40 overflow-y-auto space-y-1 no-scrollbar pr-1">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = currentLang.code === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      disabled={isUpdating}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold"
                          : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      {isSelected && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Currency Quick-Select */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Store Currency
              </p>
              <div className="grid grid-cols-4 gap-1">
                {SUPPORTED_CURRENCIES.slice(0, 4).map((curr) => {
                  const isSelected = currentCurrency.code === curr.code;
                  return (
                    <button
                      key={curr.code}
                      onClick={() => handleCurrencyChange(curr.code)}
                      disabled={isUpdating}
                      className={`px-2 py-1 rounded-lg text-xs font-bold text-center transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      }`}
                    >
                      {curr.code}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Notification Bell Button & Dropdown */}
      <div className="relative" ref={notifyRef}>
        <button
          onClick={() => {
            setIsNotifyOpen(!isNotifyOpen);
            setIsLangOpen(false);
          }}
          className={`relative p-2.5 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/60 dark:hover:bg-neutral-800 transition-all duration-200 flex items-center justify-center cursor-pointer ${
            isNotifyOpen ? "bg-neutral-100 dark:bg-neutral-800" : ""
          }`}
          title="Notifications"
          id="navbar-notifications-btn"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 min-w-[16px] h-[16px] px-1 bg-red-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white dark:ring-neutral-900">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Popup */}
        {isNotifyOpen && (
          <div className="absolute right-0 top-12 w-80 md:w-96 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl z-50 p-4 flex flex-col gap-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                Notifications ({unreadCount} unread)
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={() => markRead(undefined, true)}
                  className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto flex flex-col gap-2 no-scrollbar">
              {notifications.length === 0 ? (
                <div className="text-[12px] text-neutral-400 text-center py-6">No notifications yet.</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`p-3 rounded-xl border text-xs flex flex-col gap-1 transition-all cursor-pointer ${
                      n.isRead 
                        ? "bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400" 
                        : "bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[12px]">
                      <span className="flex items-center gap-1.5">
                        {n.notificationType === "NEW_ORDER" ? (
                          <Package size={14} className="text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <MessageSquare size={14} className="text-indigo-600 dark:text-indigo-400" />
                        )}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-normal">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2">{n.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Direct navigation to Settings -> Notifications Tab */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2.5 flex items-center justify-between">
              <Link
                href="/settings?tab=notifications"
                onClick={() => setIsNotifyOpen(false)}
                className="w-full text-center py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                id="navbar-goto-notification-settings"
              >
                <SettingsIcon size={13} />
                Notification Preferences & Settings
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LagnuagesAndNotification;
