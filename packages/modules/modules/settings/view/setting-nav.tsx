"use client";

import React from "react";
import { 
  Globe, Sun, Shield, Bell, User, Sparkles 
} from "lucide-react";

interface SettingsNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function SettingsNav({ activeTab, setActiveTab }: SettingsNavProps) {
  const navItems = [
    { 
      id: "language", 
      label: "Language & Region", 
      description: "Dialects, currency & time",
      icon: <Globe className="w-4 h-4" /> 
    },
    { 
      id: "theme", 
      label: "Theme & Styling", 
      description: "Dark, light & high contrast",
      icon: <Sun className="w-4 h-4" /> 
    },
    { 
      id: "security", 
      label: "Security & Credentials", 
      description: "Password & active devices",
      icon: <Shield className="w-4 h-4" /> 
    },
    { 
      id: "notifications", 
      label: "Notification Alerts", 
      description: "Channels & event triggers",
      icon: <Bell className="w-4 h-4" /> 
    },
    { 
      id: "account", 
      label: "Store Management", 
      description: "Vacation mode & data export",
      icon: <User className="w-4 h-4" /> 
    },
  ];

  return (
    <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 h-full flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-gray-50 dark:border-neutral-800/80 flex-shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
          Settings Console
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-2.5 space-y-1.5 min-h-0 no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs shadow-blue-600/20 dark:bg-blue-600"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800/60"
              }`}
            >
              <div
                className={`p-2 rounded-xl flex items-center justify-center ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400"
                }`}
              >
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold truncate">
                  {item.label}
                </div>
                <div
                  className={`text-[10px] truncate mt-0.5 ${
                    isActive ? "text-blue-100" : "text-gray-400 dark:text-neutral-500"
                  }`}
                >
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}