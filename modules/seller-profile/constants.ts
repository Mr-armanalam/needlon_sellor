export const SELLER_THEMES = [
  "LIGHT",
  "DARK",
  "SYSTEM",
  "HIGH_CONTRAST",
] as const;

export const PROFILE_IMAGE_BUCKET =
    "seller-profile-images";

export const MAX_PROFILE_IMAGE_SIZE =
    5 * 1024 * 1024; // 5 MB

export const ALLOWED_PROFILE_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const BUSINESS_TYPES = [
  "INDIVIDUAL",
  "PROPRIETORSHIP",
  "PARTNERSHIP",
  "LLP",
  "PRIVATE_LIMITED",
  "PUBLIC_LIMITED",
  "TRUST",
  "NGO",
  "OTHER",
] as const;


// seller-store/constants

export const STORE_IMAGE_BUCKET =
    "seller-store-images";

export const STORE_LOGO_PATH =
    "logo";

export const STORE_BANNER_PATH =
    "banner";

export const STORE_NAME_MAX_LENGTH =
    150;

export const STORE_SLUG_MAX_LENGTH =
    150;

export const SHORT_DESCRIPTION_MAX_LENGTH =
    255;

export const STORE_DESCRIPTION_MAX_LENGTH =
    5000;

export const SUPPORT_PHONE_MAX_LENGTH =
    20;

export const SUPPORT_EMAIL_MAX_LENGTH =
    255;

export const STORE_STATUSES = [
  "DRAFT",
  "PENDING_REVIEW",
  "ACTIVE",
  "SUSPENDED",
  "CLOSED",
  "VACATION_MODE",
  "MAINTENANCE",
  "UNDER_INVESTIGATION",
] as const;

export const STORE_VISIBILITIES = [
  "PRIVATE",
  "PUBLIC",
  "UNLISTED",
  "INVITE_ONLY",
  "MEMBERS_ONLY",
] as const;

export const SELLER_DOCUMENT_BUCKET =
    "seller-documents";

export const SELLER_DOCUMENT_FOLDER =
    "seller";