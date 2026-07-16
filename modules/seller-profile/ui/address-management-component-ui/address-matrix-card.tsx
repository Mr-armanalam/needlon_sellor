import React, {Dispatch, ReactNode, SetStateAction} from 'react';
import {getAddressLine, getAddressLocation} from "@/modules/seller-profile/lib/address-formate";
import {getAddressTypeLabel} from "@/modules/seller-profile/lib/address-label";
import {AddressDeleteDialog} from "@/modules/seller-profile/components/address-delete-dialog";
import {
    CheckCircle2,
    Edit3,
} from "lucide-react";
import {SellerAddressForm} from "@/modules/seller-profile/types/seller-address-form";
import {SaveStatus} from "@/modules/seller-profile/view/seller-foundation-page";
import {AddressFormDrawer} from "@/modules/seller-profile/components/address-form-drawer";


type props = {
    addr: SellerAddressForm;
    isDeleting: boolean;
    remove: (id: string) => Promise<void>;
    setSaveStatus: Dispatch<SetStateAction<SaveStatus>>;
    triggerDrawer: (node: ReactNode) => void;
    closeDrawer: () => void;
    handleDrawerSuccess: () => void;
}

const AddressMatrixCard = ({addr, isDeleting, remove, setSaveStatus, triggerDrawer, closeDrawer, handleDrawerSuccess} : props) => {
    return (
        <div className="bg-white group border border-gray-200/80 p-4 rounded-2xl shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-200 transition-all"
        >
            <div className="space-y-2">
                <div className="flex justify-between items-center gap-2">
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-md border border-blue-100 uppercase tracking-wide">
                  {getAddressTypeLabel(addr.addressType)}
                </span>
                    {addr.isVerified && (
                        <span className="text-[10px] text-green-700 font-bold bg-green-50 border border-green-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 text-green-600" /> Courier Verified
                  </span>
                    )}
                </div>
                <div>
                    <h4 className="text-xs font-bold text-gray-900 truncate">{addr.label}</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed pt-0.5">
                        {getAddressLine(addr)}
                        , {getAddressLocation(addr)}
                    </p>
                </div>
            </div>

            <div className="pt-2 border-t border-gray-50 flex justify-between">

                <AddressDeleteDialog
                    isDeleting={isDeleting}
                    remove={remove}
                    addressId={addr.id}
                    setSaveStatus={setSaveStatus}
                />

                <button
                    type="button"
                    onClick={() =>
                        triggerDrawer( <AddressFormDrawer
                            address={addr}
                            onClose={closeDrawer}
                            onSuccess={handleDrawerSuccess}
                            setSaveStatus={setSaveStatus}
                        />)
                    }
                    className="text-gray-500 ml-auto hover:text-blue-600 text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Parameters
                </button>

            </div>
        </div>
    );
};

export default AddressMatrixCard;