"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import {
    BankAccountCard,
} from "./bank-account-card";

import {
    BankAccountForm,
} from "./bank-account-form";

import {
    DeleteBankDialog,
} from "./delete-bank-dialog";

import {
    EmptyBankState,
} from "./empty-bank-state";

import {
    SellerBankAccountDto,
} from "../dto";

import {
    useSellerBank,
    useCreateBankAccount,
    useUpdateBankAccount,
    useDeleteBankAccount,
    useSetPrimaryBankAccount,
} from "../hooks";
import {BankAccountSkeleton} from "@/modules/seller-profile/components/bank-account-skeleton";

export function SellerBankSection() {
    const {
        data,
        isLoading,
    } = useSellerBank();

    const create =
        useCreateBankAccount();

    const update =
        useUpdateBankAccount();

    const remove =
        useDeleteBankAccount();

    const primary =
        useSetPrimaryBankAccount();

    const [
        editing,
        setEditing,
    ] =
        useState<SellerBankAccountDto>();

    const [
        open,
        setOpen,
    ] = useState(false);

    const [
        deleting,
        setDeleting,
    ] =
        useState<string>();

    if (isLoading) {
        return (
            <BankAccountSkeleton />
        );
    }

    return (
        <>
            <div className="space-y-6">

                <div className="flex justify-between">

                    <h2 className="text-xl font-semibold">
                        Bank &
                        Payout
                    </h2>

                    <Button
                        onClick={() => {
                            setEditing(
                                undefined,
                            );

                            setOpen(
                                true,
                            );
                        }}
                    >
                        Add Account
                    </Button>

                </div>

                {data?.accounts
                    .length === 0 ? (
                    <EmptyBankState
                        onAdd={() =>
                            setOpen(
                                true,
                            )
                        }
                    />
                ) : (
                    <div className="space-y-4">

                        {data?.accounts.map(
                            (
                                account,
                            ) => (
                                <BankAccountCard
                                    key={
                                        account.id
                                    }
                                    account={
                                        account
                                    }
                                    onEdit={() => {
                                        setEditing(
                                            account,
                                        );

                                        setOpen(
                                            true,
                                        );
                                    }}
                                    onDelete={() =>
                                        setDeleting(
                                            account.id,
                                        )
                                    }
                                    onSetPrimary={() =>
                                        primary.mutate(
                                            account.id,
                                        )
                                    }
                                />
                            ),
                        )}

                    </div>
                )}

            </div>

            <Sheet
                open={open}
                onOpenChange={
                    setOpen
                }
            >
                <SheetContent>

                    <SheetHeader>

                        <SheetTitle>
                            {editing
                                ? "Edit Bank Account"
                                : "Add Bank Account"}
                        </SheetTitle>

                    </SheetHeader>

                    <div className="mt-6">

                        <BankAccountForm
                            account={
                                editing
                            }
                            loading={
                                create.isPending ||
                                update.isPending
                            }
                            onSubmit={async (
                                values,
                            ) => {
                                if (
                                    editing
                                ) {
                                    await update.mutateAsync(
                                        {
                                            accountId:
                                            editing.id,
                                            ...values,
                                        },
                                    );
                                } else {
                                    await create.mutateAsync(
                                        values,
                                    );
                                }

                                setOpen(
                                    false,
                                );
                            }}
                        />

                    </div>

                </SheetContent>
            </Sheet>

            <DeleteBankDialog
                open={
                    !!deleting
                }
                onOpenChange={(
                    open,
                ) => {
                    if (
                        !open
                    ) {
                        setDeleting(
                            undefined,
                        );
                    }
                }}
                onConfirm={async () => {
                    if (
                        !deleting
                    ) {
                        return;
                    }

                    await remove.mutateAsync(
                        deleting,
                    );

                    setDeleting(
                        undefined,
                    );
                }}
            />
        </>
    );
}