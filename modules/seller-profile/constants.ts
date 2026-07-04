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