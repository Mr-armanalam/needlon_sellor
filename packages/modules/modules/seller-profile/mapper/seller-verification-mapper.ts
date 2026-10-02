import { sellerVerification } from "@/db/schema/seller/seller-verification";

type SellerVerificationRecord =
    typeof sellerVerification.$inferSelect;

export function toSellerVerificationRecord(
    verification: SellerVerificationRecord,
) {
    return {
        sellerId:
        verification.sellerId,

        status:
        verification.status,

        submittedAt:
            verification.submittedAt?.toISOString() ??
            null,

        reviewStartedAt:
            verification.reviewStartedAt?.toISOString() ??
            null,

        verifiedAt:
            verification.verifiedAt?.toISOString() ??
            null,

        reviewedBy:
        verification.reviewedBy,

        rejectionReason:
        verification.rejectionReason,

        reviewNotes:
        verification.reviewNotes,

        createdAt:
            verification.createdAt.toISOString(),

        updatedAt:
            verification.updatedAt.toISOString(),
    };
}