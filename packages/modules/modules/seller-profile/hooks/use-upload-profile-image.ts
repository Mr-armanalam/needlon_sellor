import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { uploadProfileImage } from "@/modules/seller-profile/services/upload-profile-image";

export function useUploadProfileImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadProfileImage,

        onSuccess(updatedProfile) {
            queryClient.setQueryData(
                ["seller-profile"],
                updatedProfile,
            );
        },
    });
}