"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function VerificationSkeleton() {
    return (
        <div className="space-y-6">

            <Skeleton className="h-40 w-full rounded-xl" />

            <div className="grid gap-6 lg:grid-cols-2">

                <Skeleton className="h-72 rounded-xl" />

                <Skeleton className="h-72 rounded-xl" />

            </div>

            <Skeleton className="h-48 rounded-xl" />

            <Skeleton className="h-24 rounded-xl" />

        </div>
    );
}