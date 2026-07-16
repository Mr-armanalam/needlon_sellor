import React from 'react';
import {WorkspaceTab} from "@/modules/seller-profile/view/seller-foundation-page";
import {NextFoundationStepDto} from "@/modules/seller-profile/dto";
import ProfileNavItems from "@/modules/seller-profile/ui/view-components-ui/profile-nav-items";
import StickySetupProgressCard from "@/modules/seller-profile/ui/view-components-ui/sticky-setup-progress-card";


type prop = {
    activeTab: string;
    setupPercent: number;
    nextStep: NextFoundationStepDto | null | undefined;
    handleTabSwitch: (id: WorkspaceTab)=> void;
}

const ProfileSidebar = ({ handleTabSwitch, activeTab, setupPercent, nextStep}: prop) => {
    return (
        <aside className="w-64 border-r border-gray-200 bg-white h-full flex-col justify-between shrink-0 hidden md:flex min-h-0">
            <div className="p-4 border-b border-gray-50 shrink-0">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Setup Workspace</h2>
            </div>

            <ProfileNavItems
              handleTabSwitch={handleTabSwitch}
              activeTab={activeTab}
            />

            <StickySetupProgressCard
              setupPercent={setupPercent}
              nextStep={nextStep}
            />
        </aside>
    );
};

export default ProfileSidebar;