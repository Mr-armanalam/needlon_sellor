import { SellerAddressForm } from "@/modules/seller-profile/types/seller-address-form";
import React, {useEffect} from "react";
import {
    MapPin,
    Home,
    Building,
    Warehouse,
    Receipt,
} from "lucide-react";
import {useAddressDrawerForm} from "@/modules/seller-profile/hooks/use-address-drawer-form";
import {SaveStatus} from "@/modules/seller-profile/view/seller-foundation-page";


interface AddressFormDrawerProps {
    address?: SellerAddressForm | null;
    onClose(): void;
    onSuccess?(): void;
    setSaveStatus: React.Dispatch<
        React.SetStateAction<SaveStatus>
    >;
}

const ADDRESS_TYPE_CHIPS = [
    {
        value: "PICKUP",
        label: "Pickup",
        icon: <Home className="w-3.5 h-3.5" />,
    },
    {
        value: "WAREHOUSE",
        label: "Warehouse",
        icon: <Warehouse className="w-3.5 h-3.5" />,
    },
    {
        value: "RETURN",
        label: "Return Hub",
        icon: <Building className="w-3.5 h-3.5" />,
    },
    {
        value: "BILLING",
        label: "Billing Office",
        icon: <Receipt className="w-3.5 h-3.5" />,
    },
] as const;

export function AddressFormDrawer({setSaveStatus, address, onClose, onSuccess }: AddressFormDrawerProps) {
    const {
        form,
        errors,
        setField,
        save,
        reset,
        isSaving,
        isDirty,
    } = useAddressDrawerForm({
        address,
        onSuccess: () => {
            onSuccess?.();
            onClose();
        },
    });

    useEffect(() => {
        if (isSaving) {
            setSaveStatus?.("Saving...");
            return;
        }

        if (isDirty) {
            setSaveStatus?.("Changes pending");
            return;
        }

        setSaveStatus?.("Saved ✓");
    }, [
        isDirty,
        isSaving,
        setSaveStatus,
    ]);

    return (
        <div className="space-y-6 h-full flex flex-col justify-between text-xs font-semibold">
            <div className="space-y-5">
                <div className="border-b border-gray-50 pb-3">
                    <h3 className="text-sm font-bold text-gray-900">
                        {address ? "Modify Location" : "Add New Address Location"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 font-normal">
                        Map out specialized regional shipping routing anchors.
                    </p>
                </div>

                {/* 1. SELECTABLE CHIPS INSTEAD OF DROPDOWNS */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Address Type Selection
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {ADDRESS_TYPE_CHIPS.map((chip) => (
                            <button
                                key={chip.value}
                                type="button"
                                onClick={() =>
                                    setField(
                                        "addressType",
                                        chip.value,
                                    )
                                }                                className={`p-3 rounded-xl border flex items-center gap-2 font-bold transition-all ${
                                form.addressType === chip.value                                        ? "border-blue-600 bg-blue-50/30 text-blue-600"
                                        : "border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                            >
                                {chip.icon}
                                {chip.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. CORE STREET ADDRESS INPUT LAYERS */}
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">
                            Friendly Label Name
                        </label>
                        <input
                            type="text"
                            value={form?.label ?? ""}                            placeholder="e.g., Central Packing Facility"
                            onChange={(e) =>
                                setField(
                                    "label",
                                    e.target.value,
                                )
                            }
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        {errors.label && (
                            <p className=" text-[11px] text-red-600">
                                {errors.label}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">
                            Street Address Details
                        </label>
                        <input
                            type="text"
                            value={form?.addressLine1}
                            placeholder="Building name, street, road markers..."
                            onChange={(e) => setField(
                                "addressLine1",
                                e.target.value,
                            )}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        {errors.addressLine1 && (
                            <p className=" text-[11px] text-red-600">
                                {errors.addressLine1}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                                City
                            </label>
                            <input
                                type="text"
                                value={form?.city}
                                placeholder="City name"
                                onChange={(e) => setField("city", e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            {errors.city && (
                                <p className=" text-[11px] text-red-600">
                                    {errors.city}
                                </p>
                            )}
                        </div>


                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                                State
                            </label>
                            <input
                                type="text"
                                value={form?.state}
                                placeholder="State"
                                onChange={(e) => setField("state", e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            {errors.state && (
                                <p className=" text-[11px] text-red-600">
                                    {errors.state}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                                Pincode / Zip
                            </label>
                            <input
                                type="text"
                                value={form?.postalCode}
                                placeholder="6-digit pin"
                                onChange={(e) => setField("postalCode", e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            {errors.postalCode && (
                                <p className=" text-[11px] text-red-600">
                                    {errors.postalCode}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                                Country Code
                            </label>
                            <input
                                type="text"
                                value={form?.countryCode}
                                placeholder="IN"
                                onChange={(e) => setField("countryCode", e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            {errors.countryCode && (
                                <p className=" text-[11px] text-red-600">
                                    {errors.countryCode}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. SIMULATED MAP BOUNDS COORDINATES HOOK CONTAINER */}
                <div className="space-y-2 pt-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Geographic Verification Map Preview
                    </label>
                    <div className="w-full h-28 bg-slate-100 border border-gray-200 rounded-xl overflow-hidden relative flex items-center justify-center text-gray-400">
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px]" />
                        <div className="z-10 text-center text-[10px] px-4 font-medium">
                            <MapPin className="w-4 h-4 text-rose-500 mx-auto mb-1 animate-bounce" />
                            {form?.addressLine1
                                ? `${form.addressLine1}, ${form.city}, ${form.state}`
                                : "Provide entry text line to position map coordinate pin"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2 bg-white">

                <button
                    type="button"
                    onClick={() => {
                        reset();
                        onClose();
                    }}
                    className="flex-1 border border-gray-200 rounded-xl py-2.5 font-bold hover:bg-gray-50"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={save}
                    disabled={!isDirty || isSaving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl"
                >
                    {isSaving ? "Saving..." : "Apply Changes"}
                </button>

            </div>
        </div>
    );
}
