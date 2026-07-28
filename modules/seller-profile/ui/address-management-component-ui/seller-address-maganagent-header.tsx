import React from 'react';
import {AddressFormDrawer} from "@/modules/seller-profile/components/address-form-drawer";
import {SaveStatus} from "@/modules/seller-profile/view/seller-foundation-page";
import { Plus, } from "lucide-react";

type props = {
    triggerDrawer: (contentNode: React.ReactNode) => void;
    closeDrawer: ()=> void;
    handleDrawerSuccess: ()=> void;
    setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
}

const SellerAddressMaganagentHeader = ({triggerDrawer, closeDrawer, handleDrawerSuccess, setSaveStatus}: props) => {
    return (
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between gap-4 flex-wrap">
            <div>
                <h2 className="text-sm font-bold text-gray-900">Business Locations</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                    Control fulfillment points across courier dispatch, return handling, and tax offices.
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
                className="bg-blue-600 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center gap-1.5"
            >
                <Plus className="w-4 h-4" /> Add New Address
            </button>
        </div>
    );
};

export default SellerAddressMaganagentHeader;