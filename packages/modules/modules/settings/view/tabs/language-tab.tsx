"use client";

import React, { useState, useEffect } from "react";
import { Globe, Clock, DollarSign, Check, Sparkles } from "lucide-react";
import {
  useSellerSettings,
  SUPPORTED_LANGUAGES,
  SUPPORTED_CURRENCIES,
  SUPPORTED_TIMEZONES,
} from "../../hooks/use-seller-settings";

export default function LanguageTab() {
  const { settings, updateSettings, isUpdating } = useSellerSettings();

  const [selectedLang, setSelectedLang] = useState(settings?.languageCode || "en");
  const [selectedCurrency, setSelectedCurrency] = useState(settings?.currencyCode || "INR");
  const [selectedTimezone, setSelectedTimezone] = useState(settings?.timezone || "Asia/Kolkata");
  const [currentTimeStr, setCurrentTimeStr] = useState("");

  useEffect(() => {
    if (settings) {
      if (settings.languageCode) setSelectedLang(settings.languageCode);
      if (settings.currencyCode) setSelectedCurrency(settings.currencyCode);
      if (settings.timezone) setSelectedTimezone(settings.timezone);
    }
  }, [settings]);

  // Live digital clock preview for selected timezone
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: selectedTimezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          weekday: "short",
          month: "short",
          day: "numeric",
        }).format(now);
        setCurrentTimeStr(formatted);
      } catch {
        setCurrentTimeStr(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedTimezone]);

  const handleSelectLanguage = async (code: string) => {
    setSelectedLang(code);
    await updateSettings({ languageCode: code });
  };

  const handleSelectCurrency = async (code: string) => {
    setSelectedCurrency(code);
    await updateSettings({ currencyCode: code });
  };

  const handleSelectTimezone = async (tz: string) => {
    setSelectedTimezone(tz);
    await updateSettings({ timezone: tz });
  };

  return (
    <div className="space-y-8 max-w-3xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-neutral-800 pb-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Language & Regional Localization
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Customize language, currency units, and store operating timezone. Changes synchronize with the top navigation bar.
            </p>
          </div>
          {isUpdating && (
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 animate-pulse bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
              Saving changes...
            </span>
          )}
        </div>
      </div>

      {/* 1. Primary Display Language */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-gray-900 dark:text-white">
            Display Language
          </label>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Select your preferred console dialect and communication vocabulary.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                disabled={isUpdating}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs ring-1 ring-blue-600/30"
                    : "border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-gray-300 dark:hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{lang.flag}</span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">
                    {lang.name}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {lang.nativeName}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Store Currency */}
      <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
        <div>
          <label className="text-xs font-bold text-gray-900 dark:text-white">
            Default Store Currency
          </label>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Applied to order cataloging, payouts breakdown, and shipping invoices.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SUPPORTED_CURRENCIES.map((curr) => {
            const isSelected = selectedCurrency === curr.code;
            return (
              <button
                key={curr.code}
                onClick={() => handleSelectCurrency(curr.code)}
                disabled={isUpdating}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 font-bold shadow-xs"
                    : "border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white flex items-center justify-center text-xs font-black">
                    {curr.symbol}
                  </span>
                  <span className="text-xs font-bold">{curr.code}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Timezone & Operating Hours */}
      <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
        <div>
          <label className="text-xs font-bold text-gray-900 dark:text-white">
            Operating Timezone
          </label>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Synchronizes order timestamps, daily revenue resets, and flash sale countdowns.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <select
              value={selectedTimezone}
              onChange={(e) => handleSelectTimezone(e.target.value)}
              disabled={isUpdating}
              className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-xs px-3.5 py-3 font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xs"
            >
              {SUPPORTED_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label} ({tz.offset})
                </option>
              ))}
            </select>
          </div>

          {/* Real-time local clock preview card */}
          <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center gap-3 shadow-sm border border-slate-800">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Current Local Time
              </div>
              <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                {currentTimeStr || "Loading..."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
