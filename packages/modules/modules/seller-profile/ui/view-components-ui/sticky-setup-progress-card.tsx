import React from 'react';
import {NextFoundationStepDto} from "@/modules/seller-profile/dto";

const StickySetupProgressCard = ({setupPercent, nextStep}:{setupPercent: number; nextStep:NextFoundationStepDto | null | undefined;}) => {
    return (
        <div className="p-4 border-t border-gray-50 bg-slate-50/50 shrink-0 space-y-3">
            <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-gray-700">
                    <span>Total Progress</span>
                    <span>{setupPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${setupPercent}%` }} />
                </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-[11px] space-y-1">


              <span className="font-bold text-gray-800 block">
               {nextStep
                   ? "Next Recommended Step"
                   : "Setup Complete"}
               </span>

                {nextStep ? (
                    <>
                        <p className="text-gray-500 font-medium">
                            {nextStep.description}
                        </p>

                        <span className="text-blue-600 font-bold block pt-1">
                      Estimated: {nextStep.estimatedMinutes} min
                    </span>
                    </>
                ) : (
                    <>
                        <p className="text-green-600 font-medium">
                            Seller foundation completed.
                        </p>

                        <span className="text-green-700 font-bold block pt-1">
                            Ready to sell 🎉
                        </span>
                    </>
                )}
            </div>
        </div>

    );
};

export default StickySetupProgressCard;