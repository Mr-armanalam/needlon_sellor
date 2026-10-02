export type AddressType =
    | "PICKUP"
    | "WAREHOUSE"
    | "RETURN"
    | "BILLING"
    | "REGISTERED_OFFICE"
    | "CORPORATE_OFFICE"
    | "SHOWROOM"
    | "FULFILLMENT_CENTER"
    | "DROPSHIP_LOCATION";

export interface SellerAddressForm {
    id: string;

    label: string;

    addressType: AddressType;

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

    latitude: number | null;
    longitude: number | null;

    isDefault: boolean;

    isVerified: boolean;

    isActive: boolean;
}