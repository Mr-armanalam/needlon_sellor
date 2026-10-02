import { deleteStorageFile } from "./delete-storage-file";
import { extractPStoragePath } from "./extract-pstorage-path";
import { uploadPrivateDocument } from "./upload-private-document";

interface ReplaceStorageFileOptions {
    bucket: string;
    folder: string;
    previousUrl?: string | null;
    file: File;
}

export async function replaceStorageFile({
                                             bucket,
                                             folder,
                                             previousUrl,
                                             file,
                                         }: ReplaceStorageFileOptions) {
    if (previousUrl) {
        await deleteStorageFile({
            bucket,
            path: extractPStoragePath(
                previousUrl,
            ),
        });
    }

    return uploadPrivateDocument({
        bucket,
        folder,
        file,
    });
}