export type BusinessType =
    | "INDIVIDUAL"
    | "PROPRIETORSHIP"
    | "PARTNERSHIP"
    | "LLP"
    | "PRIVATE_LIMITED"
    | "PUBLIC_LIMITED"
    | "TRUST"
    | "NGO"
    | "OTHER";

export interface SellerProfileForm {
    sellerId: string;

    displayName: string;

    phoneNumber: string | null;
    phoneVerified: boolean;

    profileImageUrl: string | null;

    businessName: string | null;
    businessType: BusinessType | null;

    supportEmail: string | null;
    supportPhone: string | null;

    websiteUrl: string | null;

    bio: string | null;

    dateOfBirth: string | null;
}