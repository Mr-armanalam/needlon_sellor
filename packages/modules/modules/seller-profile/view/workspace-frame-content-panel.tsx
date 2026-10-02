import React from 'react';
import BusinessIdentitySection from '../section/buisiness-identity-section';
import StoreManagementSection from '../section/store-management';
import AddressManagementSection from '../section/address-management';
import BankAndPayoutSection from '../section/bank-and-payout';
import SellerSettingsSection from '../section/seller-setting';
import {SaveStatus, WorkspaceTab} from "@/modules/seller-profile/view/seller-foundation-page";
import {NextFoundationStepDto, SellerFoundationProgressDto} from "@/modules/seller-profile/dto";
import ActiveProfileOverviewSection from "@/modules/seller-profile/section/active-profile-overview-section";
import ProfileViewHeader from "@/modules/seller-profile/ui/view-components-ui/profile-view-header";


type prop = {
    activeTab: WorkspaceTab;
    setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
    saveStatus: SaveStatus;
    isPending: boolean;
    missingStepsCount: number;
    nextStep:  NextFoundationStepDto | null | undefined;
    triggerDrawer: (content: React.ReactNode) => void;
    closeDrawer: () => void;
    foundation:  NoInfer<SellerFoundationProgressDto> | undefined;
    handleTabSwitch: (tab: WorkspaceTab) => void;
}

const WorkspaceFrameContentPanel = ({activeTab, setSaveStatus, saveStatus,isPending, missingStepsCount, nextStep, triggerDrawer, closeDrawer, foundation, handleTabSwitch }:prop) => {
    return (
        <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50/40">
           <ProfileViewHeader
               saveStatus={saveStatus}
               activeTab={activeTab}
           />

            <main className="flex-1 overflow-y-auto p-6 min-h-0 relative">
                {isPending ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-2xl w-full" />
                        <div className="h-40 bg-gray-200 rounded-2xl w-full" />
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' &&   <ActiveProfileOverviewSection missingStepsCount={missingStepsCount} nextStep={nextStep} foundation={foundation} handleTabSwitch={handleTabSwitch} />}
                        {activeTab === 'identity' && <BusinessIdentitySection setSaveStatus={setSaveStatus} />}
                        {activeTab === 'store' && <StoreManagementSection setSaveStatus={setSaveStatus} />}
                        {activeTab === 'locations' && <AddressManagementSection triggerDrawer={triggerDrawer} closeDrawer={closeDrawer} setSaveStatus={setSaveStatus} />}
                        {activeTab === 'payouts' && <BankAndPayoutSection triggerDrawer={triggerDrawer} setSaveStatus={setSaveStatus} />}
                        {activeTab === 'preferences' && <SellerSettingsSection setSaveStatus={setSaveStatus} />}
                    </>
                )}
            </main>
        </div>

    );
};

export default WorkspaceFrameContentPanel;