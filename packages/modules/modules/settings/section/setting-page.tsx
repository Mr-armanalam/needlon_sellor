"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SettingsNav from "../view/setting-nav";
import SettingsContent from "../view/setting-content";
import { Sliders, ShieldCheck } from "lucide-react";

function SettingsPageInner() {
  const searchParams = useSearchParams();
  const tabFromQuery = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<string>("language");

  useEffect(() => {
    if (tabFromQuery) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  return (
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-hidden p-4 md:p-6 bg-slate-50/60 dark:bg-neutral-950 flex-col space-y-4 md:space-y-6 min-h-0">
      {/* Page Header */}
      <div className="flex-shrink-0 flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              System Settings
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Production Store
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Configure platform themes, manage regional localization, credential security, and notification triggers.
          </p>
        </div>
      </div>

      {/* Main Split Grid Wrapper Container */}
      <div className="flex flex-1 w-full bg-white dark:bg-neutral-900 rounded-3xl shadow-xs overflow-hidden border border-gray-200/80 dark:border-neutral-800 min-h-0 flex-col md:flex-row">
        {/* Left Side: Category Navigator Rail Menu */}
        <SettingsNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* Right Side: Form Configuration Content Workspace */}
        <SettingsContent 
          activeTab={activeTab} 
        />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gray-400">Loading settings...</div>}>
      <SettingsPageInner />
    </Suspense>
  );
}