import {
    SellerDocumentDto,
    SellerVerificationDto,
} from "../dto";

const REQUIRED_DOCUMENTS = [
    "GST",
    "PAN",
] as const;

export function canSubmitVerification(
    verification: SellerVerificationDto,
    documents: SellerDocumentDto[],
) {
    if (
        verification.verification.status === "UNDER_REVIEW" ||
        verification.verification.status === "VERIFIED"
    ) {
        return false;
    }

    const uploadedTypes = new Set(
        documents.map(
            (document) => document.documentType,
        ),
    );

    return REQUIRED_DOCUMENTS.every((type) =>
        uploadedTypes.has(type),
    );
}