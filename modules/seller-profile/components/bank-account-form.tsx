"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
    FieldLegend,
    FieldDescription,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { AccountType } from "../types/account-type";
import { SellerBankAccountDto } from "../dto";

import {
    bankAccountSchema,
    BankAccountFormValues
} from "../lib/bank-account-schema";



interface Props {
    account?: SellerBankAccountDto;
    loading?: boolean;
    onSubmit(values: BankAccountFormValues): Promise<void>;
}

export function BankAccountForm({ account, loading, onSubmit }: Props) {
    const form = useForm<BankAccountFormValues>({
        resolver: zodResolver(bankAccountSchema),
        defaultValues: {
            accountHolderName: "",
            bankName: "",
            accountNumber: "",
            ifscCode: "",
            branchName: "",
            accountType: "SAVINGS",
        },
    });

    useEffect(() => {
        if (!account) return;
        form.reset({
            accountHolderName: account.accountHolderName,
            bankName: account.bankName,
            accountNumber: "",
            ifscCode: account.ifscCode,
            branchName: account.branchName ?? "",
            accountType: account.accountType,
        });
    }, [account, form]);

    return (
        <div className="w-full max-w-md">
            <form
                className="space-y-5"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>Bank Account Details</FieldLegend>
                        <FieldDescription>
                            Please provide your bank account information
                        </FieldDescription>

                        <Field>
                            <FieldLabel htmlFor="accountHolderName">Account Holder</FieldLabel>
                            <Input id="accountHolderName" {...form.register("accountHolderName")} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="bankName">Bank</FieldLabel>
                            <Input id="bankName" {...form.register("bankName")} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="accountNumber">Account Number</FieldLabel>
                            <Input id="accountNumber" {...form.register("accountNumber")} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="confirmAccountNumber">Confirm Account Number</FieldLabel>
                            <Input id="confirmAccountNumber" {...form.register("confirmAccountNumber")} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="ifscCode">IFSC</FieldLabel>
                            <Input id="ifscCode" {...form.register("ifscCode")} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="branchName">Branch</FieldLabel>
                            <Input id="branchName" {...form.register("branchName")} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="accountType">Account Type</FieldLabel>
                            <Select
                                value={form.watch("accountType")}
                                onValueChange={(val) => form.setValue("accountType", val as AccountType)}
                            >
                                <SelectTrigger id="accountType">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.values(AccountType).map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldSet>

                    <FieldSeparator />

                    <Field orientation="horizontal">
                        <Button type="submit" disabled={loading} className="w-full">
                            {account ? "Update Bank Account" : "Add Bank Account"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    );
}
