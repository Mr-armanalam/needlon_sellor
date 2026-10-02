export const PRODUCT_MEDIA = {
    MAX_IMAGES: 10,

    MAX_VIDEOS: 1,

    MAX_IMAGE_SIZE_MB: 10,

    MAX_VIDEO_SIZE_MB: 100,

    IMAGE_TYPES: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
    ],

    VIDEO_TYPES: [
        "video/mp4",
        "video/webm",
    ],

    COVER_IMAGE_INDEX: 0,
} as const;