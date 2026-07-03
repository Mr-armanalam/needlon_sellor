import { SellerAddressForm } from "../types/seller-address-form";

export function toSellerAddressForm(
    address: {
        id: string;

        label: string;

        addressType: SellerAddressForm["addressType"];

        contactPerson: string | null;
        contactPhone: string | null;
        companyName: string | null;

        addressLine1: string;
        addressLine2: string | null;

        landmark: string | null;

        city: string;
        district: string | null;

        state: string;

        postalCode: string;

        countryCode: string;

        latitude: string | number | null;
        longitude: string | number | null;

        isDefault: boolean;
        isVerified: boolean;
        isActive: boolean;
    },
): SellerAddressForm {
    return {
        id: address.id,

        label: address.label,

        addressType: address.addressType,

        contactPerson: address.contactPerson,
        contactPhone: address.contactPhone,
        companyName: address.companyName,

        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,

        landmark: address.landmark,

        city: address.city,
        district: address.district,

        state: address.state,

        postalCode: address.postalCode,

        countryCode: address.countryCode,

        latitude:
            address.latitude === null
                ? null
                : Number(address.latitude),

        longitude:
            address.longitude === null
                ? null
                : Number(address.longitude),

        isDefault: address.isDefault,

        isVerified: address.isVerified,

        isActive: address.isActive,
    };
}