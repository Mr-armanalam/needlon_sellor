"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { SellerProfileForm } from "../types/seller-profile-form";

import { useSellerProfile } from "./use-seller-profile";
import { useUpdateSellerProfile } from "./use-update-seller-profile";
import { useUploadProfileImage } from "./use-upload-profile-image";

interface Props {
    onSuccess?(): void;
}

function clone(
    profile: SellerProfileForm,
): SellerProfileForm {
    return structuredClone(profile);
}

export function useBusinessIdentityForm({
                                            onSuccess,
                                        }: Props = {}) {
    const {
        profile,
        isLoading,
    } = useSellerProfile();

    console.log("profile", profile);
    console.log("loading", isLoading);

    const updateMutation =
        useUpdateSellerProfile();

    const uploadMutation =
        useUploadProfileImage();

    const [form, setForm] =
        useState<SellerProfileForm | null>(null);

    const [initialForm, setInitialForm] =
        useState<SellerProfileForm | null>(null);

    useEffect(() => {
        if (!profile) {
            return;
        }

        const snapshot = clone(profile);

        setForm(snapshot);
        setInitialForm(snapshot);
    }, [profile]);

    const setField = useCallback(
        <K extends keyof SellerProfileForm>(
            key: K,
            value: SellerProfileForm[K],
        ) => {
            setForm((previous) => {
                if (!previous) {
                    return previous;
                }

                return {
                    ...previous,
                    [key]: value,
                };
            });
        },
        [],
    );

    const save = useCallback(async () => {
        if (!form) {
            return;
        }

        const updated =
            await updateMutation.mutateAsync(form);

        const snapshot =
            clone(updated);

        setForm(snapshot);
        setInitialForm(snapshot);

        onSuccess?.();
    }, [
        form,
        updateMutation,
        onSuccess,
    ]);

    const uploadImage = useCallback(
        async (file: File) => {
            const updated =
                await uploadMutation.mutateAsync(
                    file,
                );

            const snapshot =
                clone(updated);

            setForm(snapshot);
            setInitialForm(snapshot);

            onSuccess?.();
        },
        [
            uploadMutation,
            onSuccess,
        ],
    );

    const reset = useCallback(() => {
        if (!initialForm) {
            return;
        }

        setForm(
            clone(initialForm),
        );
    }, [initialForm]);

    const isDirty = useMemo(() => {
        if (
            !form ||
            !initialForm
        ) {
            return false;
        }

        return (
            JSON.stringify(form) !==
            JSON.stringify(initialForm)
        );
    }, [
        form,
        initialForm,
    ]);

    return {
        form,

        setField,

        save,

        uploadImage,

        reset,

        isDirty,

        isLoading,

        isSaving:
        updateMutation.isPending,

        isUploading:
        uploadMutation.isPending,
    };
}











// "use client";
//
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useUploadProfileImage } from "../hooks/use-upload-profile-image";
// import { validateProfileImage } from "../lib/validate-profile-image";
// import {
//     SellerProfileDto,
//     UpdateSellerProfileDto,
// } from "../dto/seller-profile.dto";
//
// import { useUpdateSellerProfileMutation } from "./use-update-seller-profile";
//
// interface Props {
//     profile: SellerProfileDto | null;
//
//     onSuccess?(): void;
// }
//
// function clone(
//     profile: SellerProfileDto,
// ): SellerProfileDto {
//     return structuredClone(profile);
// }
//
// export function useBusinessIdentityForm({
//                                             profile,
//                                             onSuccess,
//                                         }: Props) {
//     const updateMutation =
//         useUpdateSellerProfileMutation();
//
//     const [form, setForm] =
//         useState<SellerProfileDto | null>(null);
//
//     const [initialForm, setInitialForm] =
//         useState<SellerProfileDto | null>(null);
//
//     const uploadMutation = useUploadProfileImage();
//
//     const [imageFile, setImageFile] =
//         useState<File | null>(null);
//
//     const selectImage = async (
//         file: File,
//         sellerId: string,
//     ) => {
//         validateProfileImage(file);
//
//         setImageFile(file);
//
//         const preview =
//             URL.createObjectURL(file);
//
//         setField("profileImageUrl", preview);
//
//         const imageUrl =
//             await uploadMutation.mutateAsync({
//                 sellerId,
//                 file,
//             });
//
//         setField(
//             "profileImageUrl",
//             imageUrl,
//         );
//     };
//
//     useEffect(() => {
//         if (!profile) {
//             return;
//         }
//
//         const snapshot = clone(profile);
//
//         setForm(snapshot);
//         setInitialForm(snapshot);
//     }, [profile]);
//
//     const setField = useCallback(
//         <K extends keyof SellerProfileDto>(
//             key: K,
//             value: SellerProfileDto[K],
//         ) => {
//             setForm((previous) => {
//                 if (!previous) {
//                     return previous;
//                 }
//
//                 return {
//                     ...previous,
//                     [key]: value,
//                 };
//             });
//         },
//         [],
//     );
//
//     const save = useCallback(async () => {
//         if (!form) {
//             return;
//         }
//
//         const payload: UpdateSellerProfileDto = {
//             ...form,
//         };
//
//         await updateMutation.mutateAsync(
//             payload,
//         );
//
//         setInitialForm(clone(form));
//
//         onSuccess?.();
//     }, [
//         form,
//         updateMutation,
//         onSuccess,
//     ]);
//
//     const reset = useCallback(() => {
//         if (!initialForm) {
//             return;
//         }
//
//         setForm(clone(initialForm));
//     }, [initialForm]);
//
//     const isDirty = useMemo(() => {
//         if (!form || !initialForm) {
//             return false;
//         }
//
//         return (
//             JSON.stringify(form) !==
//             JSON.stringify(initialForm)
//         );
//     }, [form, initialForm]);
//
//     return {
//         form,
//
//         setField,
//
//         save,
//
//         reset,
//
//         isDirty,
//
//         isSaving:
//         updateMutation.isPending,
//         selectImage,
//         imageFile,
//         isUploading: uploadMutation.isPending,
//     };
// }