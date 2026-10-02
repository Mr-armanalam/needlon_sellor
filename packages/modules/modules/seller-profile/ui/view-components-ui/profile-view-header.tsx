import React from 'react';
import {SaveStatus, WorkspaceTab} from "@/modules/seller-profile/view/seller-foundation-page";

const ProfileViewHeader = ({activeTab, saveStatus}:{
    activeTab: WorkspaceTab;
    saveStatus: SaveStatus;
}) => {
    return (
        <header className="h-16 px-6 border-b border-gray-200/80 bg-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <span>Workspace</span>
                <span>/</span>
                <span className="text-gray-900 capitalize">{activeTab}</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <span className={`text-[11px] px-2.5 py-1 rounded-lg border ${
                  saveStatus === 'Saved ✓' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>{saveStatus}</span>
            </div>
        </header>
    );
};

export default ProfileViewHeader;