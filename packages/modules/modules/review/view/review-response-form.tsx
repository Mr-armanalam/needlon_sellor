"use client";

import {
    FormEvent,
    useState,
} from "react";

import {
    Send,
} from "lucide-react";

import {
    useCreateReviewResponse,
} from "../hooks/use-create-review-response";

import {
    REVIEW_RESPONSE_MAX_LENGTH,
} from "@/db/schema/reviews/review-response/constants";

interface ReviewResponseFormProps {
    reviewId: string;

    initialResponse?: string | null;
}

export function ReviewResponseForm({
                                       reviewId,
                                       initialResponse = null,
                                   }: ReviewResponseFormProps) {
    const [
        content,
        setContent,
    ] = useState(
        initialResponse ?? "",
    );

    const {
        mutate,
        isPending,
        isError,
        error,
    } =
        useCreateReviewResponse();

    const handleSubmit =
        (
            event: FormEvent<HTMLFormElement>,
        ) => {
            event.preventDefault();

            const normalizedContent =
                content.trim();

            if (!normalizedContent) {
                return;
            }

            mutate({
                reviewId,

                content:
                normalizedContent,
            });
        };

    return (
        <div className="space-y-3">
            {initialResponse ? (
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-gray-900">
                        Your Response
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-gray-600">
                    {initialResponse}
                    </p>
                    </div>
    ) : (
        <form
            onSubmit={
            handleSubmit
        }
    className="flex gap-2"
    >
    <input
        type="text"
    value={
        content
    }
    maxLength={
        REVIEW_RESPONSE_MAX_LENGTH
    }
    onChange={(
        event,
    ) =>
    setContent(
        event.target.value,
    )
}
    placeholder="Type your public response here..."
    disabled={
        isPending
    }
    aria-label="Seller review response"
    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
    />

    <button
        type="submit"
    disabled={
            isPending ||
        !content.trim()
}
    aria-label="Send seller response"
    className="flex-shrink-0 rounded-xl bg-blue-600 p-2.5 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
    <Send className="h-4 w-4" />
        </button>
        </form>
)}

    {isPending && (
        <p
            role="status"
        className="text-xs text-gray-400"
            >
            Saving response...
        </p>
    )}

    {isError && (
        <p
            role="alert"
        className="text-xs text-rose-600"
            >
            {error instanceof Error
                    ? error.message
                    : "Unable to save seller response."}
            </p>
    )}
    </div>
);
}
