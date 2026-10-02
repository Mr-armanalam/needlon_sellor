import React, {useEffect} from "react";
import { useSetUPI_ID } from "@/modules/seller-profile/hooks/use-set-bank-upi";
import { SaveStatus } from "@/modules/seller-profile/view/seller-foundation-page";
import {SellerBankAccountDto} from "@/modules/seller-profile/dto";
import {ChevronDown} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UpiIdFormValues, upiIDSchema} from "@/modules/seller-profile/validations/upi-id-schema";
import {cn} from "@/lib/utils";

interface Props {
    setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
    accounts: SellerBankAccountDto[] | undefined;
    account?: SellerBankAccountDto | undefined;
}

export const PayoutDrawerForm: React.FC<Props> = ({ setSaveStatus, accounts, account }) => {
    const set_upi = useSetUPI_ID();
    const form = useForm<UpiIdFormValues>({
        resolver: zodResolver(upiIDSchema),
        defaultValues: {
            upiId: "",
            accountId: '',
        },
    });

    const onSubmit = async (values: UpiIdFormValues) => {
        try {
            await set_upi.mutateAsync(values);
            setSaveStatus("Saved ✓");
            form.reset(); // Reset form inputs after success
        } catch (error) {
            console.error("Failed to set UPI ID:", error);
        }
    };

    useEffect(() => {
        if (!account) return;
        form.reset({
            upiId: account.upiId!,
            accountId: account.id,
        });
    }, [account, form]);

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 h-full flex flex-col justify-between text-xs font-semibold">
            <div className="space-y-5">
                <div className="border-b border-gray-50 pb-3">
                    <h3 className="text-sm font-bold text-gray-900">
                        Add UPI Payout Route
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 font-normal">
                        Link a Virtual Payment Address for fast digital checkout settlements.
                    </p>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                        UPI ID / VPA Handle
                    </label>
                    <input
                        type="text"
                        {...form.register("upiId")}

                        placeholder="e.g., username@bank"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                        Account Name
                    </label>
                    <div className="relative">
                        <select
                            {...form.register("accountId")}
                            onChange={(e) => form.setValue("accountId", e.target.value as string)}
                            className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-400 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all pr-10 cursor-pointer"
                        >
                            <option value="" disabled className="text-gray-400">
                                Select Bank Account
                            </option>
                            {accounts?.map(({bankName, id}, index) => (
                                <option key={index} value={id as string}>
                                    {bankName as string}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>
            <div className="pt-4 border-t border-gray-100 bg-white">
                <button
                    type="submit"
                    disabled={set_upi.isPending || set_upi.isSuccess}
                    className={cn("w-full text-white font-bold py-2.5 px-4 rounded-xl shadow-xs text-center", "" +
                        (set_upi.isPending|| set_upi.isSuccess) ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700")}
                >
                    Verify & Link UPI
                </button>
            </div>
        </form>
    );
};
