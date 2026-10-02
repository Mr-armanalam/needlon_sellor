import { SellerProfileDto } from "../dto/seller-profile.dto";
import { sellerProfiles } from "@/db/schema/seller/seller-profile";

type SellerProfileRecord =
    typeof sellerProfiles.$inferSelect;

export function toSellerProfileDto(
    profile: SellerProfileRecord,
): SellerProfileDto {
    return {
        sellerId: profile.sellerId,

        displayName: profile.displayName,

        phoneNumber: profile.phoneNumber,

        phoneVerified: profile.phoneVerified,

        profileImageUrl:
        profile.profileImageUrl,

        businessName:
        profile.businessName,

        businessType:
        profile.businessType,

        supportEmail:
        profile.supportEmail,

        supportPhone:
        profile.supportPhone,

        websiteUrl:
        profile.websiteUrl,

        bio: profile.bio,

        dateOfBirth:
        profile.dateOfBirth,
    };
}