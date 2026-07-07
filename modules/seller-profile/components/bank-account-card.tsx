"use client";

import {
    BadgeCheck,
    Star,
    Trash2,
    Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { SellerBankAccountDto } from "../dto";
import {BankVerificationBadge} from "@/modules/seller-profile/components/bank-verification-badge";

interface Props {
    account: SellerBankAccountDto;

    onEdit(): void;

    onDelete(): void;

    onSetPrimary(): void;
}

export function BankAccountCard({
                                    account,
                                    onEdit,
                                    onDelete,
                                    onSetPrimary,
                                }: Props) {
    return (
        <Card className="p-5 space-y-4">

            <div className="flex items-start justify-between">

                <div className="space-y-1">

                    <div className="flex items-center gap-2">

                        <h3 className="font-semibold">
                            {account.bankName}
                        </h3>

                        {account.isPrimary && (
                            <Badge>
                                Primary
                            </Badge>
                        )}

                        <BankVerificationBadge
                            status={
                                account.verificationStatus
                            }
                        />
                    </div>

                    <p className="text-sm text-muted-foreground">
                        {account.accountHolderName}
                    </p>

                    <p className="text-sm">
                        ••••••••
                        {account.accountNumberLast4}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        {account.ifscCode}
                    </p>

                </div>

                <div className="flex gap-2">

                    {!account.isPrimary && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onSetPrimary}
                        >
                            <Star className="h-4 w-4" />
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onEdit}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={onDelete}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                </div>

            </div>

        </Card>
    );
}