"use client";

import React, { useState } from "react";
import { SaveStatus } from "../view/seller-foundation-page";
import {
  useCreateBankAccount,
  useDeleteBankAccount,
  useUpdateBankAccount
} from "@/modules/seller-profile/hooks";
import {SellerBankAccountDto} from "@/modules/seller-profile/dto";
import { DeleteBankDialog } from "@/modules/seller-profile/components";
import {BankAccountSheet} from "@/modules/seller-profile/ui/bank-account-sheet";
import BankUpiCards from "@/modules/seller-profile/ui/bank-payout-ui/bank-upi-cards";
import SecurityComplianceCues from "@/modules/seller-profile/ui/bank-payout-ui/security-compliance-cues";




export default function BankAndPayoutSection({ triggerDrawer, setSaveStatus }: {
  triggerDrawer: (contentNode: React.ReactNode) => void;
  setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
}) {

  const create = useCreateBankAccount();
  const update = useUpdateBankAccount();
  const remove = useDeleteBankAccount();


  const [ editing, setEditing ] = useState<SellerBankAccountDto>();
  const [ open, setOpen ] = useState(false);
  const [ deleting, setDeleting ] = useState<string>();


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
        <BankUpiCards
          setOpen={setOpen}
          setDeleting={setDeleting}
          setEditing={setEditing}
          triggerDrawer={triggerDrawer}
          setSaveStatus={setSaveStatus}
          editing={editing}
        />

        <SecurityComplianceCues />
      </div>
    </div>

        {open && <BankAccountSheet
            isOpen={open}
            onClose = { setOpen }
            account={editing}
            loading={create.isPending || update.isPending }
            onSubmit={ async (values,) => {
               if ( editing ) {
                 await update.mutateAsync({ accountId: editing.id, ...values });
               } else {
                 await create.mutateAsync( values );
               }
               setOpen(false);
             }
            }
          />
        }

          <DeleteBankDialog
              open={ !!deleting }
              onOpenChange={( open) => { if ( !open )  setDeleting( undefined ) }}
              onConfirm={async () => {
                if ( !deleting )  return;
                await remove.mutateAsync( deleting );
                setDeleting( undefined );
              }}
          />
        </>
  );
}
