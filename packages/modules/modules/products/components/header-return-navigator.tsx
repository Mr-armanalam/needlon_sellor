import React from 'react';
import {ArrowLeft, Sparkles} from "lucide-react";

const HeaderReturnNavigator = ({onClose, currentStep}:{onClose: () => void, currentStep: number}) => {
    return (
        <div className="flex items-center justify-between border-b border-neutral-200/60 pb-4">
            <button
                onClick={onClose}
                className="flex items-center gap-2 text-[13px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors group outline-none"
            >
                <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span>Back to Products Shelf</span>
            </button>

            <div className="flex items-center gap-2 text-[12px] font-medium text-neutral-400 bg-neutral-100/80 px-2.5 py-1 rounded-lg">
                <Sparkles size={12} className="text-neutral-600" />
                <span>Step {currentStep} of 8</span>
            </div>
        </div>
    );
};

export default HeaderReturnNavigator;