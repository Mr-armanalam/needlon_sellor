import { SellerProfileForm } from "../types/seller-profile-form";

export type SellerProfileDto =
    SellerProfileForm;

export type UpdateSellerProfileDto =
    Partial<
        Omit<
            SellerProfileForm,
            "sellerId" |
            "phoneVerified"
        >
    >;