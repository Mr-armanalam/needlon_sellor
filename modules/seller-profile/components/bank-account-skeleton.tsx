"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function BankAccountSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({
                length: 2,
            }).map((_, index) => (
                <div
                    key={index}
                    className="rounded-xl border p-5 space-y-4"
                >
                    <Skeleton className="h-6 w-48" />

                    <Skeleton className="h-4 w-64" />

                    <Skeleton className="h-4 w-32" />

                    <Skeleton className="h-4 w-28" />
                </div>
            ))}
        </div>
    );
}