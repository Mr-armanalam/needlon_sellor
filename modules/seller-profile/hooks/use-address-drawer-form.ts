"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
    CreateSellerAddressDto,
    UpdateSellerAddressDto,
} from "../dto/seller-address.dto";

import { SellerAddressForm } from "../types/seller-address-form";

import { createEmptySellerAddress } from "../lib/create-empty-seller-address";

import { useCreateSellerAddressMutation } from "./use-create-seller-address";
import { useUpdateSellerAddressMutation } from "./use-update-seller-address";

interface Props {
    address?: SellerAddressForm | null;

    onSuccess?(): void;
}

function clone(
    address: SellerAddressForm,
): SellerAddressForm {
    return structuredClone(address);
}

export function useAddressDrawerForm({
                                         address,
                                         onSuccess,
                                     }: Props) {
    const createMutation =
        useCreateSellerAddressMutation();

    const updateMutation =
        useUpdateSellerAddressMutation();

    const [form, setForm] =
        useState<SellerAddressForm>(
            createEmptySellerAddress(),
        );

    const [initialForm, setInitialForm] =
        useState<SellerAddressForm>(
            createEmptySellerAddress(),
        );

    useEffect(() => {
        const snapshot = address
            ? clone(address)
            : createEmptySellerAddress();

        setForm(snapshot);
        setInitialForm(clone(snapshot));
    }, [address]);

    const setField = useCallback(
        <K extends keyof SellerAddressForm>(
            key: K,
            value: SellerAddressForm[K],
        ) => {
            setForm((previous) => ({
                ...previous,
                [key]: value,
            }));
        },
        [],
    );

    const save = useCallback(async () => {
        if (address) {
            const {
                id,
                isVerified,
                ...data
            } = form;

            const payload: UpdateSellerAddressDto = {
                id: address.id,
                data,
            };

            await updateMutation.mutateAsync(payload);
        } else {
            const {
                id,
                isVerified,
                ...payload
            } = form;

            const createPayload: CreateSellerAddressDto =
                payload;

            await createMutation.mutateAsync(
                createPayload,
            );
        }

        const snapshot = clone(form);

        setForm(snapshot);
        setInitialForm(snapshot);

        onSuccess?.();
    }, [
        form,
        address,
        createMutation,
        updateMutation,
        onSuccess,
    ]);

    const reset = useCallback(() => {
        setForm(clone(initialForm));
    }, [initialForm]);

    const isDirty = useMemo(() => {
        return (
            JSON.stringify(form) !==
            JSON.stringify(initialForm)
        );
    }, [form, initialForm]);

    return {
        form,

        setField,

        save,

        reset,

        isDirty,

        isSaving:
            createMutation.isPending ||
            updateMutation.isPending,
    };
}