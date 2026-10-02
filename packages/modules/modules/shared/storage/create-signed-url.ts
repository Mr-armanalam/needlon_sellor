import { supabaseServer } from "@/lib/supabase/server";

interface CreateSignedUrlOptions {
    bucket: string;
    path: string;
    expiresIn?: number;
}

export async function createSignedUrl({
                                          bucket,
                                          path,
                                          expiresIn = 60 * 5,
                                      }: CreateSignedUrlOptions) {
    const {
        data,
        error,
    } =
        await supabaseServer.storage
            .from(bucket)
            .createSignedUrl(
                path,
                expiresIn,
            );

    if (error) {
        throw error;
    }

    return data.signedUrl;
}