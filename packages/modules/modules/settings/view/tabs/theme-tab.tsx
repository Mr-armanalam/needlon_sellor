"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Eye, Check, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { useSellerSettings } from "../../hooks/use-seller-settings";
import { SellerTheme } from "@/modules/seller-profile/types";

export default function ThemeTab() {
  const { theme: activeNextTheme, setTheme } = useTheme();
  const { settings, updateSettings, isUpdating } = useSellerSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme: SellerTheme = settings?.theme || "SYSTEM";

  const handleSelectTheme = async (themeKey: SellerTheme) => {
    // 1. Update next-themes CSS class
    if (themeKey === "LIGHT") {
      setTheme("light");
    } else if (themeKey === "DARK") {
      setTheme("dark");
    } else if (themeKey === "SYSTEM") {
      setTheme("system");
    } else if (themeKey === "HIGH_CONTRAST") {
      setTheme("dark");
    }

    // 2. Persist to backend database
    await updateSettings({ theme: themeKey });
  };

  const themeOptions: Array<{
    id: SellerTheme;
    title: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "LIGHT",
      title: "Clean Light",
      description: "Crisp white panels with soft slate accents for high-clarity daylight environments.",
      icon: <Sun className="w-5 h-5 text-amber-500" />,
    },
    {
      id: "DARK",
      title: "Obsidian Dark",
      description: "Deep charcoal surfaces that reduce eye fatigue in evening operations.",
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
    },
    {
      id: "SYSTEM",
      title: "System Adaptive",
      description: "Automatically synchronizes with your operating system display preferences.",
      icon: <Monitor className="w-5 h-5 text-blue-500" />,
    },
    {
      id: "HIGH_CONTRAST",
      title: "High Contrast",
      description: "Maximizes legibility with intensified borders and elevated contrast ratios.",
      icon: <Eye className="w-5 h-5 text-emerald-500" />,
    },
  ];

  if (!mounted) {
    return <div className="p-6 text-xs text-gray-400">Loading display preferences...</div>;
  }

  return (
    <div className="space-y-8 max-w-3xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-neutral-800 pb-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Interface Theme & Workspace Styling
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Personalize color schemes, high-contrast modes, and background aesthetics across the seller portal.
            </p>
          </div>
          {isUpdating && (
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 animate-pulse bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
              Saving theme...
            </span>
          )}
        </div>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {themeOptions.map((opt) => {
          const isSelected = currentTheme === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelectTheme(opt.id)}
              disabled={isUpdating}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 relative ${
                isSelected
                  ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-600/30 shadow-sm"
                  : "border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-gray-300 dark:hover:border-neutral-700"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-neutral-800">
                  {opt.icon}
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                  {opt.title}
                </h3>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Theme Preview Card */}
      <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
        <div>
          <label className="text-xs font-bold text-gray-900 dark:text-white">
            Live Workspace Preview
          </label>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Interactive representation of cards, buttons, badges, and metrics in your current theme.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-gray-50/60 dark:bg-neutral-950/60 space-y-4">
          {/* Simulated Mini Header */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                Dashboard Overview
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              Live Active
            </span>
          </div>

          {/* Simulated Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Today&apos;s Gross</span>
              <p className="text-sm font-black text-gray-900 dark:text-white mt-1">₹42,850.00</p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Dispatched Units</span>
              <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-1">128 Orders</p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Fulfillment Rate</span>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">99.4%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
