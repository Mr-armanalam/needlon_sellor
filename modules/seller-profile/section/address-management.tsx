
import React from "react";
import { SaveStatus } from "../view/seller-foundation-page";
import {useSellerAddressForm} from "@/modules/seller-profile/hooks/use-seller-address-form";
import SellerAddressMaganagentHeader from "@/modules/seller-profile/ui/address-management-component-ui/seller-address-maganagent-header";
import AddressMatrixCard from "@/modules/seller-profile/ui/address-management-component-ui/address-matrix-card";
import AddressEmptyStateBlockBilling
    from "@/modules/seller-profile/ui/address-management-component-ui/address-empty-state-block-billing";


export default function AddressManagementSection({ triggerDrawer, closeDrawer, setSaveStatus}: {

    triggerDrawer: ( contentNode: React.ReactNode ) => void;
    closeDrawer: () => void;
    setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;

}) {

  const { addresses, isDeleting, remove, isLoading, defaultAddress, setDefault, isSettingDefault } = useSellerAddressForm();

  const hasBillingAddress = addresses.some( a => a.addressType === "BILLING" );

  const handleDrawerSuccess = () => {
      setSaveStatus("Saved ✓");
      closeDrawer();
  };


  return (
      <div className="space-y-6 max-w-5xl animate-in fade-in duration-200">

       <SellerAddressMaganagentHeader
         triggerDrawer={triggerDrawer}
         closeDrawer={closeDrawer}
         setSaveStatus={setSaveStatus}
         handleDrawerSuccess={handleDrawerSuccess}
       />

        {/* MATRIX CARD CONTEXT CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
             <AddressMatrixCard
                 key={addr.id}
                 addr={addr}
                 isDeleting={isDeleting}
                 remove={remove}
                 triggerDrawer={triggerDrawer}
                 closeDrawer={closeDrawer}
                 setSaveStatus={setSaveStatus}
                 handleDrawerSuccess={handleDrawerSuccess}
             />
          ))}

          {/* SMART EMPTY STATE BLOCK FOR MISSING BILLING PARAMETER CORES */}
          {!hasBillingAddress && (
              < AddressEmptyStateBlockBilling
                  triggerDrawer={triggerDrawer}
                  closeDrawer={closeDrawer}
                  setSaveStatus={setSaveStatus}
                  handleDrawerSuccess={handleDrawerSuccess}
              />
          )}
        </div>
      </div>
  );
}

