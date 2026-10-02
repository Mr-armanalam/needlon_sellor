"use client";

import { Landmark } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
    onAdd(): void;
}

export function EmptyBankState({
                                   onAdd,
                               }: Props) {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">

            <Landmark className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <h3 className="font-semibold">
                No bank account added
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
                Add your payout account to receive payments.
            </p>

            <Button
                className="mt-6"
                onClick={onAdd}
            >
                Add Bank Account
            </Button>

        </div>
    );
}