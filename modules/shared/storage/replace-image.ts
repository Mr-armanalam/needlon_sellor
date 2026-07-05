import { deleteImage } from "./delete-image";
import { extractStoragePath } from "./extract-storage-path";
import { uploadImage } from "./upload-image";

interface ReplaceImageOptions {
    bucket: string;
    folder: string;
    file: File;
    previousUrl?: string | null;
}

export async function replaceImage({
                                       bucket,
                                       folder,
                                       file,
                                       previousUrl,
                                   }: ReplaceImageOptions) {
    if (previousUrl) {
        try {
            const path =
                extractStoragePath(
                    previousUrl,
                    bucket,
                );

            await deleteImage(
                bucket,
                path,
            );
        } catch {
            /**
             * Ignore missing/invalid previous image.
             * Upload should still continue.
             */
        }
    }

    return uploadImage({
        bucket,
        folder,
        file,
    });
}