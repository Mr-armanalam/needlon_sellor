"use client";

import React from "react";
import LanguageTab from "./tabs/language-tab";
import ThemeTab from "./tabs/theme-tab";
import SecurityTab from "./tabs/security-tab";
import NotificationsTab from "./tabs/notifications-tab";
import AccountTab from "./tabs/account-tab";

interface SettingsContentProps {
  activeTab: string;
}

export default function SettingsContent({ activeTab }: SettingsContentProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 min-h-0 bg-white dark:bg-neutral-900 no-scrollbar">
      {activeTab === "language" && <LanguageTab />}
      {activeTab === "theme" && <ThemeTab />}
      {activeTab === "security" && <SecurityTab />}
      {activeTab === "notifications" && <NotificationsTab />}
      {activeTab === "account" && <AccountTab />}
    </div>
  );
}
