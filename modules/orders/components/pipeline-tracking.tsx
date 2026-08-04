import React from 'react';
import {CheckCircle2, Clock} from "lucide-react";

const PipelineTracking = (
    {
        stepsTimeline,
        currentStepIdx,
        handleAdvance,
        isFinalState,
        actionLoading,
        handleCancel
    }:{
        stepsTimeline:{
            label: string
            time: string
            description: string
        }[];
        currentStepIdx: number;
        handleAdvance:  () => Promise<void>;
        isFinalState: boolean;
        actionLoading:  boolean;
        handleCancel:  () => Promise<void>;
    }
) => {
    return (
        <div className="lg:col-span-1 bg-white border border-neutral-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col gap-6">
            <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={12} /> Pipeline Tracking
            </span>
                <h3 className="text-[15px] font-bold text-neutral-900 mt-1 tracking-tight">
                    Fulfillment Progress
                </h3>
            </div>

            {/* Interactive Stepper Vertical Node Map */}
            <div className="flex flex-col gap-5 pl-1.5 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-100">
                {stepsTimeline.map((step, idx) => {
                    const isPast = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                        <div
                            key={idx}
                            className="flex gap-4 items-start relative z-10 group"
                        >
                            {/* Node Circle Pin */}
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 mt-0.5 ${
                                    isPast
                                        ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                                        : "bg-white border-neutral-200 text-transparent"
                                }`}
                            >
                                {isPast && (
                                    <CheckCircle2
                                        size={10}
                                        strokeWidth={3}
                                        className="fill-neutral-900"
                                    />
                                )}
                            </div>

                            {/* Core Contextual Status Text Block */}
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                      <span
                          className={`text-[13px] font-semibold transition-colors ${isPast ? "text-neutral-900" : "text-neutral-400"}`}
                      >
                        {step.label}
                      </span>
                                    {step.time !== "Pending" && (
                                        <span className="text-[10px] font-bold text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded">
                          {step.time}
                        </span>
                                    )}
                                </div>
                                <p
                                    className={`text-[11px] leading-normal font-medium max-w-xs mt-0.5 ${isCurrent ? "text-neutral-500" : "text-neutral-400"}`}
                                >
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pipeline Action Controls */}
            <div className="flex flex-col gap-2 border-t border-neutral-50 pt-4 mt-2">
                <button
                    onClick={handleAdvance}
                    disabled={isFinalState || actionLoading}
                    className={`w-full py-2.5 text-white text-[12px] font-bold rounded-xl transition-all shadow-sm outline-none ${
                        isFinalState
                            ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
                            : 'bg-neutral-900 hover:bg-neutral-800'
                    }`}
                >
                    {actionLoading ? "Processing..." : "Advance Step Pipeline"}
                </button>
                <button
                    onClick={handleCancel}
                    disabled={isFinalState || actionLoading}
                    className={`w-full py-2.5 border text-[12px] font-bold rounded-xl transition-all outline-none ${
                        isFinalState
                            ? 'border-neutral-100 text-neutral-300 cursor-not-allowed'
                            : 'border-red-100 hover:bg-red-50 text-red-500 hover:text-red-600'
                    }`}
                >
                    Cancel Order
                </button>
            </div>
        </div>

    );
};

export default PipelineTracking;