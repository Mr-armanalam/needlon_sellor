import { AddressType } from "../types/seller-address-form";

const ADDRESS_TYPE_LABELS: Record<AddressType, string> = {
    PICKUP: "Pickup",
    WAREHOUSE: "Warehouse",
    RETURN: "Return",
    BILLING: "Billing",
    REGISTERED_OFFICE: "Registered Office",
    CORPORATE_OFFICE: "Corporate Office",
    SHOWROOM: "Showroom",
    FULFILLMENT_CENTER: "Fulfillment Center",
    DROPSHIP_LOCATION: "Dropship Location",
};

export function getAddressTypeLabel(
    type: AddressType,
): string {
    return ADDRESS_TYPE_LABELS[type];
}