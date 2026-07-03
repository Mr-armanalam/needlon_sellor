
"use client";
import React from "react";
import {
  Plus,
  CheckCircle2,
  Edit3,
} from "lucide-react";
import { SaveStatus } from "../section/seller-foundation-page";
import {useSellerAddressForm} from "@/modules/seller-profile/hooks/use-seller-address-form";
import {getAddressLine, getAddressLocation} from "@/modules/seller-profile/lib/address-formate";
import {getAddressTypeLabel} from "@/modules/seller-profile/lib/address-label";
import {AddressFormDrawer} from "@/modules/seller-profile/components/address-form-drawer";
import {AddressDeleteDialog} from "@/modules/seller-profile/components/address-delete-dialog";


// MAIN ADDRESS MANAGEMENT SECTION
export default function AddressManagementSection({
    triggerDrawer,
        closeDrawer,
        setSaveStatus,
}: {
    triggerDrawer: (
        contentNode: React.ReactNode,
    ) => void;
    closeDrawer: () => void;
    setSaveStatus: React.Dispatch<
        React.SetStateAction<SaveStatus>
    >;
}) {

  const { addresses, isDeleting, remove, isLoading, defaultAddress, setDefault, isSettingDefault } = useSellerAddressForm();

  const hasBillingAddress = addresses.some(
      a => a.addressType === "BILLING"
  );

    const handleDrawerSuccess = () => {
        setSaveStatus("Saved ✓");
        closeDrawer();
    };


  return (
      <div className="space-y-6 max-w-5xl animate-in fade-in duration-200">
        {/* SECTION MAIN TITLE BANNER */}
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

        {/* MATRIX CARD CONTEXT CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
              <div
                  key={addr.id}
                  className="bg-white group border border-gray-200/80 p-4 rounded-2xl shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-200 transition-all"
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
          ))}

          {/* 4. SMART EMPTY STATE BLOCK FOR MISSING BILLING PARAMETER CORES */}
          {!hasBillingAddress && (
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
          )}
        </div>
      </div>
  );
}



//
// "use client";
// import React, { useState } from "react";
// import {
//   MapPin,
//   Plus,
//   CheckCircle2,
//   Home,
//   Building,
//   Warehouse,
//   Receipt,
//   Edit3,
// } from "lucide-react";
// import { SaveStatus } from "../section/seller-foundation-page";
//
// type AddressType = {
//   id: string;
//   type: string;
//   label: string;
//   street: string;
//   city: string;
//   zip: string;
//   isVerified: boolean;
// };
//
// type PayloadType = {
//   type: string;
//   label: string;
//   street: string;
//   city: string;
//   zip: string;
// };
//
// interface AddressFormDrawerProps {
//   existingAddr: AddressType | null;
//   onSubmit: (payload: PayloadType) => void;
// }
//
// // SEPARATE DRAWER FORM COMPONENT
// function AddressFormDrawer({ existingAddr = null, onSubmit }: AddressFormDrawerProps) {
//   const [selectedType, setSelectedType] = useState(existingAddr?.type || "Pickup");
//   const [formData, setFormData] = useState({
//     label: existingAddr?.label || "",
//     street: existingAddr?.street || "",
//     city: existingAddr?.city || "",
//     zip: existingAddr?.zip || "",
//   });
//
//   return (
//       <div className="space-y-6 h-full flex flex-col justify-between text-xs font-semibold">
//         <div className="space-y-5">
//           <div className="border-b border-gray-50 pb-3">
//             <h3 className="text-sm font-bold text-gray-900">
//               {existingAddr ? "Modify Location" : "Add New Address Location"}
//             </h3>
//             <p className="text-xs text-gray-400 mt-0.5 font-normal">
//               Map out specialized regional shipping routing anchors.
//             </p>
//           </div>
//
//           {/* 1. SELECTABLE CHIPS INSTEAD OF DROPDOWNS */}
//           <div className="space-y-2">
//             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
//               Address Type Selection
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               {[
//                 { id: "Pickup", label: "Pickup", icon: <Home className="w-3.5 h-3.5" /> },
//                 { id: "Warehouse", label: "Warehouse", icon: <Warehouse className="w-3.5 h-3.5" /> },
//                 { id: "Return", label: "Return Hub", icon: <Building className="w-3.5 h-3.5" /> },
//                 { id: "Billing", label: "Billing Office", icon: <Receipt className="w-3.5 h-3.5" /> },
//               ].map((chip) => (
//                   <button
//                       key={chip.id}
//                       type="button"
//                       onClick={() => setSelectedType(chip.id)}
//                       className={`p-3 rounded-xl border flex items-center gap-2 font-bold transition-all ${
//                           selectedType === chip.id
//                               ? "border-blue-600 bg-blue-50/30 text-blue-600"
//                               : "border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
//                       }`}
//                   >
//                     {chip.icon}
//                     {chip.label}
//                   </button>
//               ))}
//             </div>
//           </div>
//
//           {/* 2. CORE STREET ADDRESS INPUT LAYERS */}
//           <div className="space-y-3">
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase">
//                 Friendly Label Name
//               </label>
//               <input
//                   type="text"
//                   value={formData.label}
//                   placeholder="e.g., Central Packing Facility"
//                   onChange={(e) => setFormData({ ...formData, label: e.target.value })}
//                   className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase">
//                 Street Address Details
//               </label>
//               <input
//                   type="text"
//                   value={formData.street}
//                   placeholder="Building name, street, road markers..."
//                   onChange={(e) => setFormData({ ...formData, street: e.target.value })}
//                   className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-bold text-gray-400 uppercase">
//                   City
//                 </label>
//                 <input
//                     type="text"
//                     value={formData.city}
//                     placeholder="City name"
//                     onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                     className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-bold text-gray-400 uppercase">
//                   Pincode / Zip
//                 </label>
//                 <input
//                     type="text"
//                     value={formData.zip}
//                     placeholder="6-digit pin"
//                     onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
//                     className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
//                 />
//               </div>
//             </div>
//           </div>
//
//           {/* 3. SIMULATED MAP BOUNDS COORDINATES HOOK CONTAINER */}
//           <div className="space-y-2 pt-1">
//             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
//               Geographic Verification Map Preview
//             </label>
//             <div className="w-full h-28 bg-slate-100 border border-gray-200 rounded-xl overflow-hidden relative flex items-center justify-center text-gray-400">
//               <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px]" />
//               <div className="z-10 text-center text-[10px] px-4 font-medium">
//                 <MapPin className="w-4 h-4 text-rose-500 mx-auto mb-1 animate-bounce" />
//                 {formData.street
//                     ? `${formData.street}, ${formData.city}`
//                     : "Provide entry text line to position map coordinate pin"}
//               </div>
//             </div>
//           </div>
//         </div>
//
//         {/* SUBMIT ACTION LAYERS */}
//         <div className="pt-4 border-t border-gray-100 flex gap-2 bg-white">
//           <button
//               type="button"
//               onClick={() => onSubmit({ type: selectedType, ...formData })}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs text-center shadow-blue-600/10"
//           >
//             Apply Changes
//           </button>
//         </div>
//       </div>
//   );
// }
//
// // MAIN ADDRESS MANAGEMENT SECTION
// export default function AddressManagementSection({
//                                                    triggerDrawer,
//                                                    setSaveStatus,
//                                                  }: {
//   triggerDrawer: (contentNode: React.ReactNode) => void;
//   setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
// }) {
//   const [addresses, setAddresses] = useState<AddressType[]>([
//     {
//       id: "addr_1",
//       type: "Pickup",
//       label: "Primary Home Pickup",
//       street: "123 Crafter Street, Industrial Sector",
//       city: "Delhi",
//       zip: "110001",
//       isVerified: true,
//     },
//     {
//       id: "addr_2",
//       type: "Warehouse",
//       label: "Regional Hub Storage",
//       street: "Block-C, Electronics Cluster Area",
//       city: "Pimpri-Chinchwad",
//       zip: "411018",
//       isVerified: true,
//     },
//     {
//       id: "addr_3",
//       type: "Return",
//       label: "Standard Returns Hub",
//       street: "123 Crafter Street, Industrial Sector",
//       city: "Delhi",
//       zip: "110001",
//       isVerified: true,
//     },
//   ]);
//
//   const handleAddNewAddress = (newAddrPayload: PayloadType) => {
//     setAddresses((prev) => [
//       ...prev,
//       { id: `addr_${Date.now()}`, ...newAddrPayload, isVerified: true },
//     ]);
//     setSaveStatus("Saved ✓");
//   };
//
//   const hasBillingAddress = addresses.some((a) => a.type === "Billing");
//
//   return (
//       <div className="space-y-6 max-w-5xl animate-in fade-in duration-200">
//         {/* SECTION MAIN TITLE BANNER */}
//         <div className="border-b border-gray-100 pb-3 flex items-center justify-between gap-4 flex-wrap">
//           <div>
//             <h2 className="text-sm font-bold text-gray-900">Business Locations</h2>
//             <p className="text-xs text-gray-400 mt-0.5">
//               Control fulfillment points across courier dispatch, return handling, and tax offices.
//             </p>
//           </div>
//           <button
//               type="button"
//               onClick={() =>
//                   triggerDrawer(
//                       <AddressFormDrawer existingAddr={null} onSubmit={handleAddNewAddress} />
//                   )
//               }
//               className="bg-blue-600 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center gap-1.5"
//           >
//             <Plus className="w-4 h-4" /> Add New Address
//           </button>
//         </div>
//
//         {/* MATRIX CARD CONTEXT CONTAINER */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {addresses.map((addr) => (
//               <div
//                   key={addr.id}
//                   className="bg-white border border-gray-200/80 p-4 rounded-2xl shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-200 transition-all"
//               >
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center gap-2">
//                 <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-md border border-blue-100 uppercase tracking-wide">
//                   {addr.type}
//                 </span>
//                     {addr.isVerified && (
//                         <span className="text-[10px] text-green-700 font-bold bg-green-50 border border-green-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
//                     <CheckCircle2 className="w-3 h-3 text-green-600" /> Courier Verified
//                   </span>
//                     )}
//                   </div>
//                   <div>
//                     <h4 className="text-xs font-bold text-gray-900 truncate">{addr.label}</h4>
//                     <p className="text-xs text-gray-500 font-medium leading-relaxed pt-0.5">
//                       {addr.street}, {addr.city} - {addr.zip}
//                     </p>
//                   </div>
//                 </div>
//
//                 <div className="pt-2 border-t border-gray-50 flex justify-end">
//                   <button
//                       type="button"
//                       onClick={() =>
//                           triggerDrawer(
//                               <AddressFormDrawer existingAddr={addr} onSubmit={handleAddNewAddress} />
//                           )
//                       }
//                       className="text-gray-500 hover:text-blue-600 text-[11px] font-bold flex items-center gap-1 transition-colors"
//                   >
//                     <Edit3 className="w-3.5 h-3.5" /> Edit Parameters
//                   </button>
//                 </div>
//               </div>
//           ))}
//
//           {/* 4. SMART EMPTY STATE BLOCK FOR MISSING BILLING PARAMETER CORES */}
//           {!hasBillingAddress && (
//               <div className="bg-slate-50/60 border border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-2.5 min-h-[140px]">
//                 <div className="space-y-1 text-xs">
//                   <p className="font-bold text-gray-700">
//                     Your buyers need a verified billing address destination
//                   </p>
//                   <p className="text-[11px] text-gray-400 font-medium max-w-xs">
//                     Add a legal address configuration to print business invoice files successfully.
//                   </p>
//                 </div>
//                 <button
//                     type="button"
//                     onClick={() =>
//                         triggerDrawer(
//                             <AddressFormDrawer existingAddr={null} onSubmit={handleAddNewAddress} />
//                         )
//                     }
//                     className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-xs transition-colors"
//                 >
//                   Add Billing Address
//                 </button>
//               </div>
//           )}
//         </div>
//       </div>
//   );
// }