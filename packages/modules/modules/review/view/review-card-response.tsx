"use client";

import {
    CornerDownRight,
} from "lucide-react";

import {
    ReviewResponseForm,
} from "./review-response-form";

interface ReviewCardResponseProps {
    reviewId: string;

    sellerResponse?: {
        content: string;
    } | null;
}

export function ReviewCardResponse({
                                       reviewId,
                                       sellerResponse,
                                   }: ReviewCardResponseProps) {
    return (
        <div className="mt-4">
            {sellerResponse ? (
                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <CornerDownRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />

                    <div>
                        <p className="text-xs font-semibold text-gray-900">
                            Your Response
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-gray-600">
                            {
                                sellerResponse.content
                            }
                        </p>
                    </div>
                </div>
            ) : (
                <ReviewResponseForm
                    reviewId={
                        reviewId
                    }
                />
            )}
        </div>
    );
}