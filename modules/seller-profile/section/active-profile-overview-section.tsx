import React from 'react';
import { WorkspaceTab} from "@/modules/seller-profile/view/seller-foundation-page";
import {ArrowRight} from "lucide-react";
import {FoundationSectionCard} from "@/modules/seller-profile/components/foundation-secion-card";
import {NextFoundationStepDto, SellerFoundationProgressDto} from "@/modules/seller-profile/dto";


type prop = {
    missingStepsCount: number;
    nextStep:  NextFoundationStepDto | null | undefined;
    foundation:  NoInfer<SellerFoundationProgressDto> | undefined;
    handleTabSwitch: (tab: WorkspaceTab) => void;
}


const ActiveProfileOverviewSection = ({missingStepsCount, nextStep, handleTabSwitch, foundation}: prop) => {

    const handleContinueSetup = () => {

        if (!nextStep)  return;
        const tab =  new URLSearchParams( nextStep.route.split("?")[1]).get("tab");
        if (tab) {
            handleTabSwitch( tab as WorkspaceTab);
        }

    }

    return (
        <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h2 className="text-lg font-black text-gray-900">Welcome back, Arman 👋</h2>
                    <p className="text-xs text-gray-500 font-medium">
                        {missingStepsCount === 0
                            ? "Your seller account is fully configured and ready to start selling."
                            : `You only need ${missingStepsCount} more ${ missingStepsCount === 1 ? "step" : "steps" } to complete your seller foundation.`}
                    </p>
                </div>
                <button
                    onClick={ handleContinueSetup }
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs shadow-blue-600/10 flex items-center gap-1.5 transition-all"
                >
                    Continue Setup <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {foundation?.sections.map(
                    (section) => (
                        <FoundationSectionCard
                            key={section.id}
                            section={section}
                            onOpen={(route) => {
                                const tab = new URLSearchParams( route.split("?")[1]).get("tab");
                                if (tab) {
                                    handleTabSwitch( tab as WorkspaceTab );
                                }
                            }}
                        />
                    ),
                )}

            </div>
        </div>

    );
};

export default ActiveProfileOverviewSection;