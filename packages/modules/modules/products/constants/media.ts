/**
 * Product Media Constants and MIME type validation
 */

export const PRODUCT_MEDIA_BUCKET = "product-images";

export const ALLOWED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
] as const;

export const ALLOWED_VIDEO_MIME_TYPES = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-matroska",
    "video/x-msvideo",
    "video/mpeg",
] as const;

export const PRODUCT_MEDIA_MAX_IMAGE_SIZE = 25 * 1024 * 1024; // 25 MB
export const PRODUCT_MEDIA_MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

/**
 * Validates whether the given MIME type is an acceptable product media format.
 * Accepts all image and video MIME types.
 */
export function isAllowedMediaMimeType(mimeType: string): boolean {
    if (!mimeType || typeof mimeType !== "string") return false;
    const lower = mimeType.toLowerCase().trim();
    if (lower.startsWith("image/") || lower.startsWith("video/")) {
        return true;
    }
    return false;
}

/**
 * Resolves the canonical media type ('IMAGE' | 'VIDEO') from the MIME type.
 */
export function getMediaTypeFromMime(mimeType: string): "IMAGE" | "VIDEO" {
    if (mimeType && mimeType.toLowerCase().startsWith("video/")) {
        return "VIDEO";
    }
    return "IMAGE";
}
