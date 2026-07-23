/**
 * ============================================================
 * Product Image Metadata
 * ============================================================
 *
 * Typed JSON stored inside
 * product_images.metadata.
 *
 * ============================================================
 */

export interface ProductImageAiMetadata {
    tags?: string[];

    generatedAlt?: string;

    confidenceScore?: number;
}

export interface ProductImageCropMetadata {
    x?: number;

    y?: number;

    width?: number;

    height?: number;
}

export interface ProductImageFocalPointMetadata {
    x?: number;

    y?: number;
}

export interface ProductImageExifMetadata {
    camera?: string;

    lens?: string;

    iso?: number;

    shutterSpeed?: string;

    aperture?: string;

    capturedAt?: string;
}

export interface ProductImageMetadata {
    ai?: ProductImageAiMetadata;

    crop?: ProductImageCropMetadata;

    focalPoint?: ProductImageFocalPointMetadata;

    exif?: ProductImageExifMetadata;

    custom?: Record<string, unknown>;
}