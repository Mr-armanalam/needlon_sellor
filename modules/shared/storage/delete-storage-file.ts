import { supabaseServer } from "@/lib/supabase/server";

interface DeleteStorageFileOptions {
    bucket: string;
    path: string;
}

export async function deleteStorageFile({
                                            bucket,
                                            path,
                                        }: DeleteStorageFileOptions) {
    const { error } =
        await supabaseServer.storage
            .from(bucket)
            .remove([path]);

    if (error) {
        throw error;
    }
}