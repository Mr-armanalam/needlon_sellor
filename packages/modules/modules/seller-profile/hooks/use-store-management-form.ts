"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { SellerStoreForm } from "../types/seller-store-form";

import { useSellerStore } from "./use-seller-store";
import { useUpdateSellerStore } from "./use-update-seller-store";
import { useUploadStoreLogo } from "./use-upload-store-logo";
import { useUploadStoreBanner } from "./use-upload-store-banner";

interface Props {
    onSuccess?(): void;
}

function clone(
    store: SellerStoreForm,
): SellerStoreForm {
    return structuredClone(store);
}

export function useStoreManagementForm({
                                           onSuccess,
                                       }: Props = {}) {
    const {
        store,
        isLoading,
    } = useSellerStore();

    const updateMutation =
        useUpdateSellerStore();

    const logoMutation =
        useUploadStoreLogo();

    const bannerMutation =
        useUploadStoreBanner();

    const [form, setForm] =
        useState<SellerStoreForm | null>(
            null,
        );

    const [
        initialForm,
        setInitialForm,
    ] = useState<SellerStoreForm | null>(
        null,
    );

    useEffect(() => {
        if (!store) {
            return;
        }

        const snapshot =
            clone(store);

        setForm(snapshot);
        setInitialForm(snapshot);
    }, [store]);

    const setField =
        useCallback(
            <
                K extends keyof SellerStoreForm,
            >(
                key: K,
                value: SellerStoreForm[K],
            ) => {
                setForm(
                    (previous) => {
                        if (!previous) {
                            return previous;
                        }

                        return {
                            ...previous,
                            [key]:
                            value,
                        };
                    },
                );
            },
            [],
        );

    const save =
        useCallback(async () => {
            if (!form) {
                return;
            }

            const updated =
                await updateMutation.mutateAsync(
                    form,
                );

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

    const uploadLogo =
        useCallback(
            async (
                file: File,
            ) => {
                const updated =
                    await logoMutation.mutateAsync(
                        file,
                    );

                const snapshot =
                    clone(updated);

                setForm(snapshot);
                setInitialForm(snapshot);

                onSuccess?.();
            },
            [
                logoMutation,
                onSuccess,
            ],
        );

    const uploadBanner =
        useCallback(
            async (
                file: File,
            ) => {
                const updated =
                    await bannerMutation.mutateAsync(
                        file,
                    );

                const snapshot =
                    clone(updated);

                setForm(snapshot);
                setInitialForm(snapshot);

                onSuccess?.();
            },
            [
                bannerMutation,
                onSuccess,
            ],
        );

    const reset =
        useCallback(() => {
            if (
                !initialForm
            ) {
                return;
            }

            setForm(
                clone(
                    initialForm,
                ),
            );
        }, [
            initialForm,
        ]);

    const isDirty =
        useMemo(() => {
            if (
                !form ||
                !initialForm
            ) {
                return false;
            }

            return (
                JSON.stringify(
                    form,
                ) !==
                JSON.stringify(
                    initialForm,
                )
            );
        }, [
            form,
            initialForm,
        ]);

    return {
        form,

        setField,

        save,

        reset,

        uploadLogo,

        uploadBanner,

        isDirty,

        isLoading,

        isSaving:
        updateMutation.isPending,

        isUploadingLogo:
        logoMutation.isPending,

        isUploadingBanner:
        bannerMutation.isPending,
    };
}