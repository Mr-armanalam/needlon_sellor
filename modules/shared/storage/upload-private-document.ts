import { randomUUID } from "crypto";

import { supabaseServer } from "@/lib/supabase/server";

interface UploadPrivateDocumentOptions {
    bucket: string;
    folder: string;
    file: File;
}

export async function uploadPrivateDocument({
                                                bucket,
                                                folder,
                                                file,
                                            }: UploadPrivateDocumentOptions) {
    const extension =
        file.name.split(".").pop()?.toLowerCase() ??
        "pdf";

    const path =
        `${folder}/${randomUUID()}.${extension}`;

    const { error } =
        await supabaseServer.storage
            .from(bucket)
            .upload(path, file, {
                upsert: false,
                cacheControl: "3600",
            });

    if (error) {
        throw error;
    }

    return path;
}