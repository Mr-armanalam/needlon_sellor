import { randomUUID } from "crypto";
import { supabaseServer } from "@/lib/supabase/server";
import {
    PRODUCT_MEDIA_BUCKET,
    isAllowedMediaMimeType,
    getMediaTypeFromMime,
} from "../constants/media";

export interface UploadProductMediaOptions {
    productId: string;
    file: File | Blob | Buffer | ArrayBuffer;
    fileName: string;
    mimeType: string;
}

export interface UploadProductMediaResult {
    publicUrl: string;
    storageKey: string;
    mediaType: "IMAGE" | "VIDEO";
    fileName: string;
    mimeType: string;
}

// `@/lib/supabase/server` resolves differently per app: in apps/client it is a
// factory function returning a client, in apps/seller it is the client itself.
// This conditional type resolves to the client type in both cases.
export type SupabaseServerClient =
    typeof supabaseServer extends (...args: never) => infer R
        ? R
        : typeof supabaseServer;

export function getSupabaseServerClient(): SupabaseServerClient {
    const server: unknown = supabaseServer;
    if (typeof server === "function") {
        return (server as () => SupabaseServerClient)();
    }
    return server as SupabaseServerClient;
}

/**
 * Ensures that the product-images storage bucket exists in Supabase.
 */
async function ensureProductMediaBucket(): Promise<void> {
    try {
        const client = getSupabaseServerClient();
        if (!client || !client.storage) return;
        const { data: buckets } = await client.storage.listBuckets();
        const exists = buckets?.some((b) => b.id === PRODUCT_MEDIA_BUCKET || b.name === PRODUCT_MEDIA_BUCKET);
        if (!exists) {
            await client.storage.createBucket(PRODUCT_MEDIA_BUCKET, { public: true });
        }
    } catch (err) {
        // Warning only; bucket may already exist or permissions might restrict bucket listing
        console.warn("[ensureProductMediaBucket] Check/Create bucket warning:", err);
    }
}

/**
 * Uploads a product media file (image or video) directly to the Supabase storage bucket.
 * Returns the permanent public CDN URL and storage path.
 */
export async function uploadProductMediaToSupabase({
    productId,
    file,
    fileName,
    mimeType,
}: UploadProductMediaOptions): Promise<UploadProductMediaResult> {
    if (!isAllowedMediaMimeType(mimeType)) {
        throw new Error(`Unsupported media format (${mimeType}). All standard image and video types are accepted.`);
    }

    await ensureProductMediaBucket();

    const mediaType = getMediaTypeFromMime(mimeType);
    const extension = fileName.split(".").pop()?.toLowerCase() || (mediaType === "VIDEO" ? "mp4" : "jpg");
    const uniqueId = randomUUID();
    const storageKey = `products/${productId}/${uniqueId}.${extension}`;

    // Convert file to appropriate payload for Supabase storage upload
    let uploadPayload: Buffer | Uint8Array | Blob;
    if (file instanceof Buffer) {
        uploadPayload = file;
    } else if (file instanceof ArrayBuffer) {
        uploadPayload = Buffer.from(file);
    } else if (file instanceof Blob) {
        const arrayBuf = await file.arrayBuffer();
        uploadPayload = Buffer.from(arrayBuf);
    } else {
        uploadPayload = file;
    }

    const client = getSupabaseServerClient();
    const { error: uploadError } = await client.storage
        .from(PRODUCT_MEDIA_BUCKET)
        .upload(storageKey, uploadPayload, {
            contentType: mimeType,
            cacheControl: "3600",
            upsert: false,
        });

    if (uploadError) {
        throw new Error(`Supabase media upload failed: ${uploadError.message}`);
    }

    const { data } = client.storage
        .from(PRODUCT_MEDIA_BUCKET)
        .getPublicUrl(storageKey);

    return {
        publicUrl: data.publicUrl,
        storageKey,
        mediaType,
        fileName,
        mimeType,
    };
}

/**
 * Converts a base64 Data URL to a Supabase storage asset if provided,
 * preventing raw base64 dataURLs from being stored in the database.
 */
export async function uploadProductMediaDataUrlToSupabase(
    productId: string,
    dataUrl: string,
    originalFileName?: string
): Promise<UploadProductMediaResult> {
    const match = dataUrl.match(/^data:([a-zA-Z0-9.+_-]+\/[a-zA-Z0-9.+_-]+);base64,(.+)$/);
    if (!match) {
        throw new Error("Invalid base64 data URL format.");
    }

    const mimeType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, "base64");
    const ext = mimeType.split("/")[1] || "jpg";
    const fileName = originalFileName || `upload-${Date.now()}.${ext}`;

    return uploadProductMediaToSupabase({
        productId,
        file: buffer,
        fileName,
        mimeType,
    });
}
