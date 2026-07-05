import { randomUUID } from "crypto";

import { supabaseServer } from "@/lib/supabase/server";

interface UploadFileOptions {
    bucket: string;

    folder: string;

    file: File;

    fileName?: string;

    cacheControl?: string;

    upsert?: boolean;
}

export async function uploadFile({
                                     bucket,
                                     folder,
                                     file,
                                     fileName,
                                     cacheControl = "3600",
                                     upsert = false,
                                 }: UploadFileOptions) {
    const extension =
        file.name.split(".").pop()?.toLowerCase() ??
        "bin";

    const finalName =
        fileName ??
        randomUUID();

    const path =
        `${folder}/${finalName}.${extension}`;

    const { error } =
        await supabaseServer.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl,
                upsert,
            });

    if (error) {
        throw error;
    }

    const {
        data: { publicUrl },
    } =
        supabaseServer.storage
            .from(bucket)
            .getPublicUrl(path);

    return publicUrl;
}