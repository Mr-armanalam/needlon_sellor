"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Plus,
  CheckCircle2,
  Building,
  Layers,
  CheckCircle, Star, Pencil, Trash2, EllipsisVertical,
} from "lucide-react";
import { SaveStatus } from "../view/seller-foundation-page";
import {
  useCreateBankAccount,
  useDeleteBankAccount,
  useSellerBank, useSetPrimaryBankAccount,
  useUpdateBankAccount
} from "@/modules/seller-profile/hooks";
import {SellerBankAccountDto} from "@/modules/seller-profile/dto";
import {
  BankAccountSkeleton,
  DeleteBankDialog,
  EmptyBankState
} from "@/modules/seller-profile/components";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {BankAccountSheet} from "@/modules/seller-profile/ui/bank-account-sheet";
import {useDeleteBankUpi} from "@/modules/seller-profile/hooks/use-delete-bank-upi";
import {PayoutDrawerForm} from "./bank-upi-sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useSetUPI_ID} from "@/modules/seller-profile/hooks/use-set-bank-upi";

export default function BankAndPayoutSection({
  triggerDrawer,
  setSaveStatus,
}: {
  triggerDrawer: (contentNode: React.ReactNode) => void;
  setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
}) {


  const {
    data,
    isLoading,
  } = useSellerBank();
  const unset_upi = useDeleteBankUpi();

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
  const upi_list = (data?.accounts ?? [])
      .filter((item) => item.upiId) // keep only accounts with UPI
      .map((item) => ({
        id: item.id,
        type: "UPI Route",
        handler: item.upiId!, // non-null after filter
        isDefault: item.isPrimary,
        status: item.verificationStatus,
      }));


  return (
      <>
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-200">
      {/* SECTION TITLE HEADER */}
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold text-gray-900">Payouts & Banking</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage settlement routing engines safely under advanced encryption
          keys.
        </p>
      </div>

      {/* DUAL COLUMN SPLIT FRAMEWORK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT COMPONENT COLUMN (BANK AND UPI CARDS) */}
        <div className="lg:col-span-2 space-y-6">
          {/* CATEGORY BLOCK 1: IMMUTABLE BANK ACCOUNT TILES */}
          <div className="space-y-3">
            <div className="flex justify-between items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Building className="w-3.5 h-3.5" /> Bank Accounts
              </h3>
              <Button
                  variant={'link'}
                  className={'text-gray-400'}
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

            <div className="grid grid-cols-1 gap-4">
              {data && data?.accounts?.length > 0 ? data?.accounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white group border border-gray-200 p-4 rounded-2xl shadow-xs space-y-4 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-gray-900">
                          {account.bankName}
                        </h4>
                        <span className="text-[9px] font-extrabold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100 uppercase">
                            {account.isPrimary ? "Primary" : "Secondary"}
                        </span>
                      </div>
                      <p className="text-gray-500 font-mono tracking-wide pt-1">
                        ••••••••
                        {account.accountNumberLast4}
                      </p>
                      <span className="text-[11px] text-gray-400 block pt-0.5">
                        {account.accountType} ACCOUNT
                      </span>
                    </div>

                    <div className={'flex gap-x-4'}>

                      <div className={'group-hover:block hidden'}>


                    <div className="text-[10px] h-auto bg-gray-50 px-4 py-1.5 rounded-full flex items-center gap-3">
                      {!account.isPrimary && (
                          <>
                            <Star
                                onClick={() =>
                                    primary.mutate(
                                        account.id,
                                    )}
                                className="size-3 hover:text-blue-700 cursor-pointer" />{" "}
                            <Separator orientation={"vertical"} />
                          </>
                      )}
                      <Pencil
                          onClick={() => {
                            setEditing(
                                account,
                            );

                            setOpen(
                                true,
                            );
                          }}
                          className="size-3 hover:text-blue-700 cursor-pointer" />{" "}
                      <Separator orientation={"vertical"} />
                      <Trash2
                          onClick={() =>
                              setDeleting(
                                  account.id,
                              )}
                          className="size-3 hover:text-blue-700 cursor-pointer" />{" "}
                    </div>
                      </div>

                    <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />{" "}
                      {account.verificationStatus}
                    </span>
                    </div>
                  </div>

                  {/* IMMUTABLE INLINE WARNING MESSAGE BLOCK */}
                  <div className="pt-3 border-t border-gray-50 text-[10px] text-gray-400 font-medium">
                    To adjust account values, please add a new verification
                    profile target. Legacy connections are archived
                    automatically to maintain audit trail compliance.
                  </div>
                </div>
              )):(
                  <EmptyBankState
                      onAdd={() =>
                          setOpen(
                              true,
                          )
                      }
                  />
              )}
            </div>
          </div>

          {/* CATEGORY BLOCK 2: FLEXIBLE PAYOUT METHOD PIPELINES */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Payout Configurations
              </h3>
              <button
                type="button"
                onClick={() => triggerDrawer(<PayoutDrawerForm accounts={data?.accounts} setSaveStatus={setSaveStatus} />)}
                className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-0.5"
              >
                <Plus className="w-3.5 h-3.5" /> Link UPI Handle
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {upi_list && upi_list?.length > 0 && upi_list?.map((pay) => (
                <div
                  key={pay.id}
                  className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-200 transition-all"
                >
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center gap-2">
                      <div className={'flex items-center gap-2'}>
                        <span
                          className="text-[10px] font-bold bg-slate-50 border px-2 py-0.5 rounded-md text-gray-600 tracking-wide uppercase">
                                            {pay.type}
                                          </span>
                        <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                pay.status === "VERIFIED"
                                    ? "bg-green-50 text-green-700 border border-green-100"
                                    : "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}
                        >
                          {pay.status}
                        </span>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger className="hover:bg-gray-100 rounded-xs" >
                          <EllipsisVertical size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() => triggerDrawer(<PayoutDrawerForm account={editing} accounts={data?.accounts} setSaveStatus={setSaveStatus} />)}
                            >Edit</DropdownMenuItem>
                            <Separator />
                            <DropdownMenuItem onClick={async ()=> await unset_upi.mutateAsync(pay.id)}>Delete</DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>

                    </div>
                    <div>
                      <h4 className="font-mono font-bold text-gray-900 truncate">
                        {pay.handler}
                      </h4>
                      {pay.isDefault && (
                        <span className="text-[10px] text-gray-400 font-medium mt-0.5 block">
                          Configured for active payouts
                        </span>
                      )}
                    </div>
                  </div>

                  {/* DYNAMIC TIMELINE STEPS INNER VIEWPORT EMBED */}
                  <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400">
                    <div className="flex items-center gap-1 text-blue-600">
                      <CheckCircle className="w-3 h-3 text-blue-600" /> Linked
                    </div>
                    <div className="h-px bg-gray-200 flex-1 mx-2" />
                    <div
                      className={
                        pay.status === "VERIFIED"
                          ? "text-blue-600 flex items-center gap-1"
                          : "text-gray-400"
                      }
                    >
                      {pay.status === "VERIFIED" && (
                        <CheckCircle className="w-3 h-3 text-blue-600" />
                      )}{" "}
                      Verified
                    </div>
                    <div className="h-px bg-gray-200 flex-1 mx-2" />
                    <span
                      className={
                        pay.isDefault ? "text-blue-600" : "text-gray-400"
                      }
                    >
                      Primary
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT COLUMN: SECURITY AND COMPLIANCE CUES */}
        <div className="space-y-4 sticky top-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-gray-900">
                  Encrypted Financial Vault
                </h4>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Needlon Hub hashes payment routes securely using bank-grade
                  transit standards. Complete internal account digits are never
                  exposed to public interface views.
                </p>
              </div>
            </div>
          </div>

          {/* DYNAMIC METRIC HOOK BOX */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
              Settlement Cycle
            </span>
            <p className="font-medium text-slate-300 leading-normal">
              Verified Primary streams push earnings into registered vaults
              every Tuesday at{" "}
              <strong className="text-white">12:00 PM IST</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>

        {open && <BankAccountSheet
               isOpen={open}
               onClose = { setOpen }
               account={editing}
               loading={create.isPending || update.isPending }
               onSubmit={ async (values,) => {
                 if ( editing ) {
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

                 setOpen(false);
               }
        }
        />
        }

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
