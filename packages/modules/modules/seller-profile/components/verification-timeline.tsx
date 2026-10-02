"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SellerVerificationDto } from "../dto";
import {BadgeCheck, FileSearch, Send} from "lucide-react";

interface Props {
    verification: SellerVerificationDto;
}

const STEPS = [
    {
        key: "SUBMITTED",
        title: "Submitted",
        desc: "Upload required documents",
        icon: Send,
    },
    {
        key: "UNDER_REVIEW",
        title: "Under Review",
        desc: "Our team will review your documents",
        icon: FileSearch,
    },
    {
        key: "VERIFIED",
        title: "Verified",
        desc: "You can start selling",
        icon: BadgeCheck,
    },
] as const;

export function VerificationTimeline({ verification }: Props) {
    const status = verification.verification.status;


    const currentStep =
        status === "NOT_SUBMITTED"
            ? -1
            : status === "PENDING"
                ? 0
                : status === "UNDER_REVIEW"
                    ? 1
                    : status === "VERIFIED"
                        ? 2
                        : status === "REJECTED"
                            ? 1
                            : 2;

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] h-full min-h-[220px]">
            <h3 className="text-sm font-bold text-gray-900 mb-5">Verification Timeline</h3>

            {/* Absolute Vertical Connective Stack */}
            <div className="relative flex flex-col space-y-5">
                {STEPS.map((step, idx) => {
                    const Icon =
                             step.icon;

                         const completed =
                            idx <=
                             currentStep;
                    return (
                    <div key={idx} className="flex gap-4 relative items-start">

                        {/* Thread Line Anchor Link */}
                        {idx < STEPS.length - 1 && (
                            <div className="absolute top-5 left-3 w-px h-7 bg-gray-200" />
                        )}

                        {/* Stepper Node Ring Indicator */}
                        <div className={cn(
                            "w-4 h-4 rounded-full border-2 flex items-center justify-center relative z-10 flex-shrink-0 mt-0.5 transition-all",
                            completed
                                ? "border-blue-600 bg-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.15)]"
                                : "border-gray-300 bg-white"
                        )} />

                        {/* Step Metadata lines */}
                        <div className="text-xs font-semibold space-y-0.5 leading-none">
                            <h4 className={cn("font-bold text-gray-900", !completed && "text-gray-800 font-semibold")}>
                                {step.title}
                            </h4>
                            <p className="text-[11px] text-gray-400 font-normal leading-normal">{step.desc}</p>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
}

// "use client";
//
// import {
//     BadgeCheck,
//     Clock3,
//     FileSearch,
//     Send,
// } from "lucide-react";
//
// import { cn } from "@/lib/utils";
//
// import { SellerVerificationDto } from "../dto";
//
// interface Props {
//     verification: SellerVerificationDto;
// }
//
// const STEPS = [
//     {
//         key: "SUBMITTED",
//         title: "Submitted",
//         icon: Send,
//     },
//     {
//         key: "UNDER_REVIEW",
//         title: "Under Review",
//         icon: FileSearch,
//     },
//     {
//         key: "VERIFIED",
//         title: "Verified",
//         icon: BadgeCheck,
//     },
// ] as const;
//
// export function VerificationTimeline({
//                                          verification,
//                                      }: Props) {
//     const status =
//         verification.verification.status;
//
//     const currentStep =
//         status === "NOT_SUBMITTED"
//             ? -1
//             : status === "PENDING"
//                 ? 0
//                 : status === "UNDER_REVIEW"
//                     ? 1
//                     : status === "VERIFIED"
//                         ? 2
//                         : status === "REJECTED"
//                             ? 1
//                             : 2;
//
//     return (
//         <div className="rounded-xl border bg-card p-6">
//
//             <h3 className="mb-6 font-semibold">
//                 Verification Progress
//             </h3>
//
//             <div className="flex items-start justify-between">
//
//                 {STEPS.map(
//                     (
//                         step,
//                         index,
//                     ) => {
//                         const Icon =
//                             step.icon;
//
//                         const completed =
//                             index <=
//                             currentStep;
//
//                         return (
//                             <div
//                                 key={
//                                     step.key
//                                 }
//                                 className="flex flex-1 flex-col items-center"
//                             >
//                                 <div
//                                     className={cn(
//                                         "flex h-12 w-12 items-center justify-center rounded-full border",
//                                         completed
//                                             ? "border-primary bg-primary text-primary-foreground"
//                                             : "border-muted bg-muted text-muted-foreground",
//                                     )}
//                                 >
//                                     <Icon className="h-5 w-5" />
//                                 </div>
//
//                                 <span className="mt-3 text-sm font-medium">
//                                     {
//                                         step.title
//                                     }
//                                 </span>
//
//                                 {index <
//                                     STEPS.length -
//                                     1 && (
//                                         <div
//                                             className={cn(
//                                                 "mt-6 h-1 w-full",
//                                                 completed
//                                                     ? "bg-primary"
//                                                     : "bg-muted",
//                                             )}
//                                         />
//                                     )}
//                             </div>
//                         );
//                     },
//                 )}
//
//             </div>
//
//             {verification.verification.submittedAt && (
//                 <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
//
//                     <Clock3 className="h-4 w-4" />
//
//                     Submitted on{" "}
//                     {new Date(
//                         verification.verification.submittedAt,
//                     ).toLocaleString()}
//
//                 </div>
//             )}
//
//         </div>
//     );
// }