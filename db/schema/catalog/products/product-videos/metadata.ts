/**
 * ============================================================
 * Product Video Metadata
 * ============================================================
 *
 * Typed JSON stored inside
 * product_videos.metadata.
 *
 * ============================================================
 */

export interface ProductVideoAiMetadata {
    tags?: string[];

    summary?: string;

    confidenceScore?: number;
}

export interface ProductVideoTranscriptMetadata {
    language?: string;

    transcript?: string;

    generated?: boolean;
}

export interface ProductVideoChapter {
    title: string;

    startSeconds: number;

    endSeconds: number;
}

export interface ProductVideoEncodingMetadata {
    codec?: string;

    bitrate?: number;

    frameRate?: number;

    quality?: string;
}

export interface ProductVideoCaptionMetadata {
    language: string;

    url: string;
}

export interface ProductVideoMetadata {
    ai?: ProductVideoAiMetadata;

    transcript?: ProductVideoTranscriptMetadata;

    chapters?: ProductVideoChapter[];

    captions?: ProductVideoCaptionMetadata[];

    encoding?: ProductVideoEncodingMetadata;

    custom?: Record<string, unknown>;
}