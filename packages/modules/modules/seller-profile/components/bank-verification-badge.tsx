"use client";

import { Badge } from "@/components/ui/badge";

import { BankVerificationStatus } from "../types/bank-verification-status";

interface Props {
    status: BankVerificationStatus;
}

const STATUS = {
    PENDING: {
        label: "Pending",
        className:
            "bg-amber-100 text-amber-700",
    },

    IN_REVIEW: {
        label: "In Review",
        className:
            "bg-blue-100 text-blue-700",
    },

    VERIFIED: {
        label: "Verified",
        className:
            "bg-green-100 text-green-700",
    },

    REJECTED: {
        label: "Rejected",
        className:
            "bg-red-100 text-red-700",
    },

    SUSPENDED: {
        label: "Suspended",
        className:
            "bg-orange-100 text-orange-700",
    },

    FAILED: {
        label: "Failed",
        className:
            "bg-red-100 text-red-700",
    },
} as const;

export function BankVerificationBadge({
                                          status,
                                      }: Props) {
    const config =
        STATUS[status];

    return (
        <Badge
            className={
                config.className
            }
        >
            {config.label}
        </Badge>
    );
}