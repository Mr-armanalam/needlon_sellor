import { SellerAddressForm } from "../types/seller-address-form";

export type SellerAddressDto = SellerAddressForm;

export type CreateSellerAddressDto = Omit<
    SellerAddressForm,
    "id" | "isVerified"
>;

export interface UpdateSellerAddressDto {
    id: string;

    data: Partial<
        Omit<
            SellerAddressForm,
            "id" | "isVerified"
        >
    >;
}