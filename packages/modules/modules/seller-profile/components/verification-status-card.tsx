"use client";

import React from "react";
import {Shield, Info, CircleAlert, Clock3, FileSearch, BadgeCheck, ShieldCheck} from "lucide-react";
import { SellerVerificationDto } from "../dto";
import {cn} from "@/lib/utils";

interface Props {
    verification: SellerVerificationDto;
}

const STATUS_CONFIG = {
    NOT_SUBMITTED: {
        label: "Not Submitted",
        icon: Shield,
        className:
            "bg-muted text-muted-foreground",
        description:
            "Upload your required documents to begin verification.",
    },

    PENDING: {
        label: "Pending",
        icon: Clock3,
        className:
            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        description:
            "Your verification request has been received.",
    },

    UNDER_REVIEW: {
        label: "Under Review",
        icon: FileSearch,
        className:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        description:
            "Our team is reviewing your submitted documents.",
    },

    VERIFIED: {
        label: "Verified",
        icon: BadgeCheck,
        className:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        description:
            "Your seller account has been successfully verified.",
    },

    REJECTED: {
        label: "Rejected",
        icon: CircleAlert,
        className:
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        description:
            "Some documents require your attention before resubmission.",
    },

    EXPIRED: {
        label: "Expired",
        icon: ShieldCheck,
        className:
            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
        description:
            "One or more verification documents have expired.",
    },
} as const;

export function VerificationStatusCard({ verification }: Props) {
        const status =
        STATUS_CONFIG[
            verification.verification.status
            ];

    const Icon = status.icon;
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between h-full min-h-[220px]">
            <div className="flex items-start gap-4">
                {/* Soft blue background badge with thin icon line style */}
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full flex-shrink-0">
                    <Icon className="w-6 h-6 stroke-[1.5]" />
                </div>

                <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-gray-900">Verification Status</h3>

                    {/* Subtle Orange Status Pill Badge */}
                    <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide", status.className)}>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {status.label.toLocaleUpperCase()}
                    </div>

                    <p className="text-sm text-gray-500 font-normal pt-1">
                        You haven&apos;t submitted your business for verification yet.
                    </p>
                </div>
            </div>

            {/* Light Muted Blue Notification Strip Bar */}
            <div className="bg-blue-50/50 mt-4 border border-blue-100/40 rounded-xl p-3.5 flex gap-2.5 items-center text-blue-900 text-xs font-medium">
                <Info className="size-4 text-blue-500 shrink-0" />
                <span>{status.description}</span>

            </div>
            {verification.verification.rejectionReason && (
                <div className="rounded-lg mt-4 flex items-center border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                    <p className="text-sm text-red-700 dark:text-red-300">
                        Rejection reason: &nbsp;
                    </p>

                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {
                            verification?.verification?.rejectionReason ?? 'Arman Alam'
                        }
                    </p>
                </div>
            )}

            {verification.verification.reviewNotes && (
                <div className="rounded-lg mt-4 flex items-center border p-4">
                    <p className="text-sm">
                        Review Notes: &nbsp;
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {
                            verification.verification.reviewNotes
                        }
                    </p>
                </div>
            )}
        </div>
    );
}






// "use client";
//
// import {
//     BadgeCheck,
//     CircleAlert,
//     Clock3,
//     FileSearch,
//     ShieldCheck,
// } from "lucide-react";
//
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
//
// import { cn } from "@/lib/utils";
//
// import {
//     SellerVerificationDto,
// } from "../dto";
//
// interface Props {
//     verification: SellerVerificationDto;
// }
//
// const STATUS_CONFIG = {
//     NOT_SUBMITTED: {
//         label: "Not Submitted",
//         icon: CircleAlert,
//         className:
//             "bg-muted text-muted-foreground",
//         description:
//             "Upload your required documents to begin verification.",
//     },
//
//     PENDING: {
//         label: "Pending",
//         icon: Clock3,
//         className:
//             "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
//         description:
//             "Your verification request has been received.",
//     },
//
//     UNDER_REVIEW: {
//         label: "Under Review",
//         icon: FileSearch,
//         className:
//             "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
//         description:
//             "Our team is reviewing your submitted documents.",
//     },
//
//     VERIFIED: {
//         label: "Verified",
//         icon: BadgeCheck,
//         className:
//             "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
//         description:
//             "Your seller account has been successfully verified.",
//     },
//
//     REJECTED: {
//         label: "Rejected",
//         icon: CircleAlert,
//         className:
//             "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
//         description:
//             "Some documents require your attention before resubmission.",
//     },
//
//     EXPIRED: {
//         label: "Expired",
//         icon: ShieldCheck,
//         className:
//             "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
//         description:
//             "One or more verification documents have expired.",
//     },
// } as const;
//
// export function VerificationStatusCard({
//                                            verification,
//                                        }: Props) {
//     const status =
//         STATUS_CONFIG[
//             verification.verification.status
//             ];
//
//     const Icon = status.icon;
//
//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>
//                     Verification Status
//                 </CardTitle>
//             </CardHeader>
//
//             <CardContent className="space-y-5">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <p className="text-sm text-muted-foreground">
//                             Current Status
//                         </p>
//
//                         <div
//                             className={cn(
//                                 "mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
//                                 status.className,
//                             )}
//                         >
//                             <Icon className="size-4" />
//
//                             {status.label}
//                         </div>
//                     </div>
//                 </div>
//
//                 <p className="text-sm text-muted-foreground">
//                     {status.description}
//                 </p>
//
//                 {verification.verification.rejectionReason && (
//                     <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
//                         <p className="font-medium text-red-700 dark:text-red-300">
//                             Rejection Reason
//                         </p>
//
//                         <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//                             {
//                                 verification.verification.rejectionReason
//                             }
//                         </p>
//                     </div>
//                 )}
//
//                 {verification.verification.reviewNotes && (
//                     <div className="rounded-lg border p-4">
//                         <p className="font-medium">
//                             Review Notes
//                         </p>
//
//                         <p className="mt-1 text-sm text-muted-foreground">
//                             {
//                                 verification.verification.reviewNotes
//                             }
//                         </p>
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     );
// }