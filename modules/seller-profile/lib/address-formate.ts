import { SellerAddressForm } from "../types/seller-address-form";

export function getAddressLine(
    address: SellerAddressForm,
) {
    return [
        address.addressLine1,
        address.addressLine2,
    ]
        .filter(Boolean)
        .join(", ");
}

export function getAddressLocation(
    address: SellerAddressForm,
) {
    return [
        address.city,
        address.state,
        address.postalCode,
    ]
        .filter(Boolean)
        .join(", ");
}

export function getAddressContact(
    address: SellerAddressForm,
) {
    return [
        address.contactPerson,
        address.contactPhone,
    ]
        .filter(Boolean)
        .join(" • ");
}

export function getFullAddress(
    address: SellerAddressForm,
) {
    return [
        getAddressLine(address),
        getAddressLocation(address),
        address.countryCode,
    ]
        .filter(Boolean)
        .join(", ");
}