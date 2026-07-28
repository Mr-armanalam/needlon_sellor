import React, {Dispatch, ReactNode, SetStateAction} from 'react';
import {AddressFormDrawer} from "@/modules/seller-profile/components/address-form-drawer";
import {SaveStatus} from "@/modules/seller-profile/view/seller-foundation-page";


type props = {
    setSaveStatus: Dispatch<SetStateAction<SaveStatus>>;
    triggerDrawer: (node: ReactNode) => void;
    closeDrawer: () => void;
    handleDrawerSuccess: () => void;
}

const AddressEmptyStateBlockBilling = ({triggerDrawer, closeDrawer, handleDrawerSuccess, setSaveStatus}: props) => {
    return (
        <div className="bg-slate-50/60 border border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-2.5 min-h-[140px]">
            <div className="space-y-1 text-xs">
                <p className="font-bold text-gray-700">
                    Your buyers need a verified billing address destination
                </p>
                <p className="text-[11px] text-gray-400 font-medium max-w-xs">
                    Add a legal address configuration to print business invoice files successfully.
                </p>
            </div>
            <button
                type="button"
                onClick={() =>
                    triggerDrawer(<AddressFormDrawer
                        address={null}
                        onClose={closeDrawer}
                        onSuccess={handleDrawerSuccess}
                        setSaveStatus={setSaveStatus}
                    />)
                }
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-xs transition-colors"
            >
                Add Billing Address
            </button>
        </div>
    );
};

export default AddressEmptyStateBlockBilling;