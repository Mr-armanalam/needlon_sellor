import { SellerVerificationStatus } from "@/modules/seller-profile/types/seller-verification-status";

export interface SellerVerificationRecordDto {
    sellerId: string;
    status: SellerVerificationStatus;
    submittedAt: string | null;
    reviewStartedAt: string | null;
    verifiedAt: string | null;
    rejectionReason: string | null;
    reviewNotes: string | null;
    createdAt: string;
    updatedAt: string;
}