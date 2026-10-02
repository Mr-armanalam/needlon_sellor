import { randomUUID } from "crypto";

import { supabaseServer } from "@/lib/supabase/server";

interface UploadImageOptions {
    bucket: string;
    folder: string;
    file: File;
}

export async function uploadImage({
                                      bucket,
                                      folder,
                                      file,
                                  }: UploadImageOptions) {
    const extension =
        file.name.split(".").pop()?.toLowerCase() ?? "jpg";

    const path =
        `${folder}/${randomUUID()}.${extension}`;

    const { error } =
        await supabaseServer.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: "3600",
                upsert: false,
            });

    if (error) {
        throw error;
    }

    const {
        data: { publicUrl },
    } = supabaseServer.storage
        .from(bucket)
        .getPublicUrl(path);

    return publicUrl;
}