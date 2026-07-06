"use client";

import {
    BadgeCheck,
    Clock3,
    FileSearch,
    Send,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { SellerVerificationDto } from "../dto";

interface Props {
    verification: SellerVerificationDto;
}

const STEPS = [
    {
        key: "SUBMITTED",
        title: "Submitted",
        icon: Send,
    },
    {
        key: "UNDER_REVIEW",
        title: "Under Review",
        icon: FileSearch,
    },
    {
        key: "VERIFIED",
        title: "Verified",
        icon: BadgeCheck,
    },
] as const;

export function VerificationTimeline({
                                         verification,
                                     }: Props) {
    const status =
        verification.verification.status;

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
        <div className="rounded-xl border bg-card p-6">

            <h3 className="mb-6 font-semibold">
                Verification Progress
            </h3>

            <div className="flex items-start justify-between">

                {STEPS.map(
                    (
                        step,
                        index,
                    ) => {
                        const Icon =
                            step.icon;

                        const completed =
                            index <=
                            currentStep;

                        return (
                            <div
                                key={
                                    step.key
                                }
                                className="flex flex-1 flex-col items-center"
                            >
                                <div
                                    className={cn(
                                        "flex h-12 w-12 items-center justify-center rounded-full border",
                                        completed
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-muted bg-muted text-muted-foreground",
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>

                                <span className="mt-3 text-sm font-medium">
                                    {
                                        step.title
                                    }
                                </span>

                                {index <
                                    STEPS.length -
                                    1 && (
                                        <div
                                            className={cn(
                                                "mt-6 h-1 w-full",
                                                completed
                                                    ? "bg-primary"
                                                    : "bg-muted",
                                            )}
                                        />
                                    )}
                            </div>
                        );
                    },
                )}

            </div>

            {verification.verification.submittedAt && (
                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">

                    <Clock3 className="h-4 w-4" />

                    Submitted on{" "}
                    {new Date(
                        verification.verification.submittedAt,
                    ).toLocaleString()}

                </div>
            )}

        </div>
    );
}