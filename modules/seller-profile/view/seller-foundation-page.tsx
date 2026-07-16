'use client'
import React, { useState, useTransition, ReactNode } from 'react';
import {useSellerFoundation} from "@/modules/seller-profile/hooks/use-seller-foundation";
import ProfileSidebar from "@/modules/seller-profile/view/profile-sidebar";
import WorkspaceFrameContentPanel from "@/modules/seller-profile/view/workspace-frame-content-panel";


export type WorkspaceTab = 'overview' | 'identity' | 'store' | 'locations' | 'payouts' | 'preferences';
export type SaveStatus = 'Saved ✓' | 'Saving...' | 'Changes pending';

export default function SellerFoundationPage() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('Saved ✓');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [drawerContent, setDrawerContent] = useState<ReactNode | null>(null);

  const {
    data:foundation,
    isLoading,
  } = useSellerFoundation();


  const setupPercent = foundation?.percentage ?? 0;

  const missingStepsCount =
      foundation
          ? foundation.totalSections -
          foundation.completedSections
          : 0;

  const nextStep =
      foundation?.nextStep;

  const handleTabSwitch = (id: WorkspaceTab) => {
    startTransition(() => {
      setActiveTab(id);
    });
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerContent(null);
  };

  const triggerDrawer = (contentNode: ReactNode) => {
    setDrawerContent(contentNode);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-64px)] w-full overflow-hidden font-sans antialiased bg-slate-50/50 p-4 relative min-h-0">
      
      {/* SLIDE-OVER DRAWER */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-xs" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-gray-100 p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300 min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
              {drawerContent}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 w-full bg-white rounded-3xl shadow-xs overflow-hidden border border-gray-200/80 min-h-0">
        <ProfileSidebar
            handleTabSwitch={handleTabSwitch}
            activeTab={activeTab}
            setupPercent={setupPercent}
            nextStep={nextStep}
        />
        <WorkspaceFrameContentPanel
            activeTab={activeTab}
            isPending={isPending}
            saveStatus={saveStatus}
            missingStepsCount={missingStepsCount}
            nextStep={nextStep}
            triggerDrawer={triggerDrawer}
            closeDrawer={closeDrawer}
            foundation={foundation}
            handleTabSwitch={handleTabSwitch}
            setSaveStatus={setSaveStatus}
        />
      </div>
    </div>
  );
}