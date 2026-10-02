import React from 'react';
import {wizardSteps} from "@/modules/products/constants";
import {Check} from "lucide-react";

const StepperNodeProgressTracker = ({currentStep}: {currentStep: number}) => {
    return (
        <div className="bg-white border border-neutral-100 p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col gap-4">
            <div className="flex items-center justify-between overflow-x-auto no-scrollbar pb-1">
                {wizardSteps.map((step, idx) => (
                    <div key={step.number} className="flex items-center gap-2 shrink-0">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                            currentStep >= step.number ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'
                        }`}>
                            {currentStep > step.number ? <Check size={10} strokeWidth={3} /> : step.number}
                        </div>
                        <span className={`text-[12px] font-semibold tracking-tight ${
                            currentStep === step.number ? 'text-neutral-900' : 'text-neutral-400'
                        }`}>
                {step.label}
              </span>
                        {idx !== wizardSteps.length - 1 && <span className="text-neutral-200 text-[11px] mx-0.5">/</span>}
                    </div>
                ))}
            </div>
            <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-900 rounded-full transition-all duration-300 ease-out" style={{ width: `${((currentStep - 1) / (wizardSteps.length - 1)) * 100}%` }} />
            </div>
        </div>

    );
};

export default StepperNodeProgressTracker;