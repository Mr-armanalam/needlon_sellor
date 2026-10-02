import {supabaseClient} from "@/lib/supabase/client";

interface DeleteFileParams {
    bucket: string;
    path: string;
}

export async function deleteFile({
                                     bucket,
                                     path,
                                 }: DeleteFileParams) {
    const { error } =
        await supabaseClient.storage
            .from(bucket)
            .remove([path]);

    if (error) {
        throw error;
    }
}


// interface DeleteFileParams {
//     bucket: string;
//     path: string;
// }
//
// export async function deleteFile({
//                                      bucket,
//                                      path,
//                                  }: DeleteFileParams) {
//     const supabase = supabaseClient();
//
//     const { error } =
//         await supabase.storage
//             .from(bucket)
//             .remove([path]);
//
//     if (error) {
//         throw error;
//     }
// }