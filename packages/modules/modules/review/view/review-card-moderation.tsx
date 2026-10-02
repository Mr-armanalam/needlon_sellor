import {
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";

import type {
    ReviewStatus,
} from "@/db/schema/reviews";

interface ReviewModerationStateProps {
    status: ReviewStatus;
}

export function ReviewModerationState({
                                          status,
                                      }: ReviewModerationStateProps) {
    if (
        status === "FLAGGED"
    ) {
        return (
            <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-xs font-medium text-rose-600">
                <AlertTriangle className="h-3.5 w-3.5" />
                Flagged
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Published
        </span>
    );
}

