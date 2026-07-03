import { SellerAddressForm } from "../types/seller-address-form";

export function createEmptySellerAddress(): SellerAddressForm {
    return {
        id: "",

        label: "",

        addressType: "PICKUP",

        contactPerson: null,
        contactPhone: null,
        companyName: null,

        addressLine1: "",
        addressLine2: null,

        landmark: null,

        city: "",
        district: null,

        state: "",

        postalCode: "",

        countryCode: "IN",

        latitude: null,
        longitude: null,

        isDefault: false,
        isVerified: false,
        isActive: true,
    };
}