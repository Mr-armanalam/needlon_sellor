import { supabaseServer } from "@/lib/supabase/server";

export async function deleteImage(
    bucket: string,
    path: string,
) {
    const { error } =
        await supabaseServer.storage
            .from(bucket)
            .remove([path]);

    if (error) {
        throw error;
    }
}