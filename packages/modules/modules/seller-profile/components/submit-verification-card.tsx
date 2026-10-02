"use client";

import React from "react";
import { Lock, Info, Send } from "lucide-react";
import {SellerVerificationDto} from "@/modules/seller-profile/dto";
import {Button} from "@/components/ui/button";

interface Props {
    verification: SellerVerificationDto;
    canSubmit: boolean;
    loading?: boolean;
    onSubmit: () => void;
}

export function SubmitVerificationCard({
                                           verification,
                                           canSubmit,
                                           loading = false,
                                           onSubmit,
                                       }: Props) {

        const disabled =  !canSubmit || loading ||
        verification.verification.status ===  "UNDER_REVIEW" ||  verification.verification.status ===  "VERIFIED";

    console.log(verification, 'verification')
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs font-semibold">

            {/* Title block with lock icon */}
            <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full flex-shrink-0">
                    <Lock className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div className="min-w-0 space-y-0.5">
                    <h3 className="text-base font-bold text-gray-900">Submit Verification</h3>
                    <p className="text-xs text-gray-400 font-normal leading-normal">
                        Please upload all required documents to submit your verification.
                    </p>
                </div>
            </div>

            {/* Dynamic central validation alert banner */}
            <div className="bg-blue-50/50 border border-blue-100/50 text-blue-900 p-3 px-4 rounded-xl flex items-center gap-2 font-medium text-xs flex-1 max-w-xl lg:mx-4">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                {/*<span>You need to upload all required documents before submitting.</span>*/}
                {verification.verification.status ===
                    "NOT_SUBMITTED" && (
                        <span className=" text-muted-foreground">
                            Upload all required documents
                            before submitting.
                        </span>
                    )}

                {verification.verification.status ===
                    "REJECTED" && (
                        <span className=" text-destructive">
                            Please resolve rejected
                            documents before submitting
                            again.
                        </span>
                    )}

                {verification.verification.status ===
                    "UNDER_REVIEW" && (
                        <span className=" text-muted-foreground">
                            Your documents are currently
                            under review.
                        </span>
                    )}

                {verification.verification.status ===
                    "PENDING" && (
                        <span className=" text-muted-foreground">
                            Your documents are currently pending for next step.
                        </span>
                    )}

                {verification.verification.status ===
                    "VERIFIED" && (
                        <span className=" text-green-600">
                            Congratulations! Your seller
                            account has already been
                            verified.
                        </span>
                    )}
            </div>

            {/* Block Form Submit Action Button */}
            <Button
                type="button"
                variant={'outline'}
                disabled={disabled}
                onClick={onSubmit}
                className="font-semibold text-green-700 transition-all flex items-center justify-center gap-1.5 w-auto h-auto pr-12 text-xs shadow-inner"
            >
                <Send className="w-3.5 h-3.5 text-gray-300" />
                <p> {loading ? "Submitting..." : "Submit Verification"} </p>
            </Button>

        </div>
    );
}




// "use client";
//
// import { Loader2, Send } from "lucide-react";
//
// import { Button } from "@/components/ui/button";
//
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
//
// import { SellerVerificationDto } from "../dto";
//
// interface Props {
//     verification: SellerVerificationDto;
//
//     canSubmit: boolean;
//
//     loading?: boolean;
//
//     onSubmit: () => void;
// }
//
// export function SubmitVerificationCard({
//                                            verification,
//                                            canSubmit,
//                                            loading = false,
//                                            onSubmit,
//                                        }: Props) {
//
//     const disabled =
//         !canSubmit ||
//         loading ||
//         verification.verification.status ===
//         "UNDER_REVIEW" ||
//         verification.verification.status ===
//         "VERIFIED";
//
//     return (
//         <Card>
//
//             <CardHeader>
//
//                 <CardTitle>
//                     Submit Verification
//                 </CardTitle>
//
//                 <CardDescription>
//                     After submitting, our team will
//                     review your documents. During the
//                     review period you won&apos;t be able to
//                     modify uploaded documents.
//                 </CardDescription>
//
//             </CardHeader>
//
//             <CardContent>
//
//                 {verification.verification.status ===
//                     "NOT_SUBMITTED" && (
//                         <p className="text-sm text-muted-foreground">
//                             Upload all required documents
//                             before submitting.
//                         </p>
//                     )}
//
//                 {verification.verification.status ===
//                     "REJECTED" && (
//                         <p className="text-sm text-destructive">
//                             Please resolve rejected
//                             documents before submitting
//                             again.
//                         </p>
//                     )}
//
//                 {verification.verification.status ===
//                     "UNDER_REVIEW" && (
//                         <p className="text-sm text-muted-foreground">
//                             Your documents are currently
//                             under review.
//                         </p>
//                     )}
//
//                 {verification.verification.status ===
//                     "VERIFIED" && (
//                         <p className="text-sm text-green-600">
//                             Congratulations! Your seller
//                             account has already been
//                             verified.
//                         </p>
//                     )}
//
//             </CardContent>
//
//             <CardFooter>
//
//                 <Button
//                     className="w-full"
//                     disabled={disabled}
//                     onClick={onSubmit}
//                 >
//                     {loading ? (
//                         <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//
//                             Submitting...
//                         </>
//                     ) : (
//                         <>
//                             <Send className="mr-2 h-4 w-4" />
//
//                             Submit For Review
//                         </>
//                     )}
//                 </Button>
//
//             </CardFooter>
//
//         </Card>
//     );
// }