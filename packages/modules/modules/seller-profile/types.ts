
export type SellerTheme = "LIGHT" | "DARK" | "SYSTEM" | "HIGH_CONTRAST";

export const DOCUMENT_TYPES = [
    "GST",
    "PAN",
    "AADHAAR",
    "MSME",
    "FSSAI",
    "IEC",
    "TRADEMARK",
    "BUSINESS_REGISTRATION",
    "SHOP_LICENSE",
    "DRUG_LICENSE",
    "EXPORT_LICENSE",
    "ISO_CERTIFICATE",
    "CANCELLED_CHEQUE",
    "OTHER",
] as const;

export type DocumentType =
    (typeof DOCUMENT_TYPES)[number];

export const VERIFICATION_STATUSES = [
    "UPLOADED",
    "PENDING_REVIEW",
    "UNDER_REVIEW",
    "VERIFIED",
    "REJECTED",
    "EXPIRED",
] as const;

export type VerificationStatus =
    (typeof VERIFICATION_STATUSES)[number];

export const VERIFICATION_METHODS = [
    "MANUAL",
    "OCR",
    "API",
    "THIRD_PARTY_KYC",
] as const;

export type VerificationMethod =
    (typeof VERIFICATION_METHODS)[number];