"use client";

import React, {Dispatch, SetStateAction, useEffect} from "react";
import { X, Building2, ShieldCheck, ChevronDown, Lock } from "lucide-react";
import {SellerBankAccountDto} from "@/modules/seller-profile/dto";
import {BankAccountFormValues, bankAccountSchema} from "@/modules/seller-profile/lib/bank-account-schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {AccountType} from "@/modules/seller-profile/types/account-type";

interface BankAccountSheetProps {
    isOpen?: boolean;
    onClose: Dispatch<SetStateAction<boolean>>;
    account: SellerBankAccountDto | undefined ;
    loading: boolean;
    onSubmit(values: BankAccountFormValues): Promise<void>;
}

export function BankAccountSheet({ isOpen = true, onClose, onSubmit, loading, account}: BankAccountSheetProps) {
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
            {/* Semi-transparent Backdrop Overlay */}
            <div
                className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity"
                onClick={() =>onClose(false)}
            />

            {/* Slide-over Sheet Panel Container */}
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-gray-100 flex flex-col justify-between animate-in slide-in-from-right duration-300 min-h-0 text-xs font-semibold z-10">

                {/* 1. SHEET HEADER */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/50">
                            <Building2 className="w-4 h-4 stroke-[1.5]" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900 tracking-tight">
                                {account
                                    ? "Edit Bank Account"
                                    : "Add Bank Account"
                                }
                            </h2>
                            <p className="text-[11px] text-gray-400 font-normal mt-0.5">Please provide your bank account information</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>onClose(false)}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* 2. FORM BODY (SCROLLABLE AREA) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">

                    {/* Section Sub-header */}
                    <div className="space-y-0.5 pb-1">
                        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Bank Account Details</h3>
                        <p className="text-[11px] text-gray-400 font-normal">Ensure details match your official passbook or statement.</p>
                    </div>

                    {/* Account Holder Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Account Holder Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...form.register("accountHolderName")}
                            placeholder="Full name as registered in bank"
                            className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Bank Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Bank Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...form.register("bankName")}
                            placeholder="e.g. HDFC Bank, Central Bank of India"
                            className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Account Number */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Account Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="password"
                            {...form.register('accountNumber')}
                            placeholder="Enter complete account number"
                            className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 font-mono font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Confirm Account Number */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Confirm Account Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...form.register("confirmAccountNumber")}
                            placeholder="Re-enter account number"
                            className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 font-mono font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
                        />
                    </div>

                    {/* IFSC Code */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            IFSC Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...form.register("ifscCode")}
                            placeholder="11 character alphanumeric code"
                            className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 font-mono font-bold text-blue-600 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Branch Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Branch Name
                        </label>
                        <input
                            type="text"
                            {...form.register("branchName")}
                            placeholder="Branch location"
                            className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Account Type Dropdown */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Account Type <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                {...form.register("accountType")}
                                onChange={(e) => form.setValue("accountType", e.target.value as AccountType)}
                                className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 font-semibold text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all pr-10 cursor-pointer"
                            >
                                {Object.values(AccountType).map((type, index) => (
                                    <option key={index} value={type as string}>
                                        {type as string}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Security Banner Note */}
                    <div className="bg-blue-50/40 border border-blue-100/60 rounded-xl p-3.5 flex items-start gap-2.5 text-blue-900 text-[11px] font-normal leading-relaxed mt-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>
              Your banking details are encrypted and stored securely. Needlon Hub uses these details strictly for automated payout settlements.
            </span>
                    </div>

                </div>

                {/* 3. FOOTER ACTION BAR */}
                <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                        <Lock className="w-3.5 h-3.5 stroke-[2]" />
                        Update Bank Account
                    </button>
                </div>

            </form>
        </div>
    );
}