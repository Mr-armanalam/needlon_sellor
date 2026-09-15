"use client";

import {
    useState,
} from "react";

import {
    useReportReview,
} from "../hooks/use-report-review";

const REPORT_REASONS = [
    "Inappropriate content",
    "Spam",
    "Harassment or abuse",
    "False or misleading content",
    "Other",
] as const;

interface ReviewReportDialogProps {
    reviewId: string;

    onClose: () => void;
}

export function ReviewReportDialog({
                                       reviewId,
                                       onClose,
                                   }: ReviewReportDialogProps) {
    const [
        reason,
        setReason,
    ] = useState<string>(
        REPORT_REASONS[0],
    );

    const {
        mutate,
        isPending,
        isError,
        error,
    } =
        useReportReview();

    const handleSubmit =
        () => {
            mutate(
                {
                    reviewId,
                    reason,
                },
                {
                    onSuccess:
                    onClose,
                },
            );
        };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-report-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <h2
                    id="review-report-title"
                    className="text-sm font-semibold text-gray-900"
                >
                    Flag Review
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                    Select the reason for reporting
                    this review.
                </p>

                <div className="mt-4 space-y-2">
                    {REPORT_REASONS.map(
                        (item) => (
                            <label
                                key={item}
                                className="flex cursor-pointer items-center gap-2 text-xs text-gray-700"
                            >
                                <input
                                    type="radio"
                                    name="review-report-reason"
                                    value={item}
                                    checked={
                                        reason ===
                                        item
                                    }
                                    onChange={() =>
                                        setReason(
                                            item,
                                        )
                                    }
                                />

                                <span>
                                    {item}
                                </span>
                            </label>
                        ),
                    )}
                </div>

                {isError && (
                    <p
                        role="alert"
                        className="mt-4 text-xs text-rose-600"
                    >
                        {error instanceof Error
                            ? error.message
                            : "Unable to flag this review."}
                    </p>
                )}

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        disabled={
                            isPending
                        }
                        onClick={
                            onClose
                        }
                        className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={
                            isPending
                        }
                        onClick={
                            handleSubmit
                        }
                        className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPending
                            ? "Flagging..."
                            : "Flag Review"}
                    </button>
                </div>
            </div>
        </div>
    );
}

