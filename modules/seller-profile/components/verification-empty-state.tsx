"use client";

import { ShieldAlert } from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

export function VerificationEmptyState() {
    return (
        <Card>

            <CardContent className="flex flex-col items-center justify-center py-16">

                <ShieldAlert className="mb-5 h-14 w-14 text-muted-foreground" />

                <h3 className="text-lg font-semibold">
                    Verification Not Started
                </h3>

                <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
                    Upload your required business documents to
                    start the seller verification process.
                </p>

            </CardContent>

        </Card>
    );
}