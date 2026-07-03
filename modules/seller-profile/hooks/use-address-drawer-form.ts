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
import {createSellerAddressSchema} from "@/modules/seller-profile/validations/create-seller-address-schema";
import {updateSellerAddressSchema} from "@/modules/seller-profile/validations/update-seller-address-schema";

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
    const [errors, setErrors] = useState<
        Partial<Record<keyof SellerAddressForm, string>>
    >({});

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
            setForm((previous) => {
                if (!previous) return previous;

                return {
                    ...previous,
                    [key]: value,
                };
            });

            setErrors((previous) => ({
                ...previous,
                [key]: undefined,
            }));
        },
        [],
    );

    const save = useCallback(async () => {
        const schema = address
            ? updateSellerAddressSchema
            : createSellerAddressSchema;

        const parsed = schema.safeParse(
            address
                ? {
                    id: address.id,
                    data: form,
                }
                : form,
        );

        if (!parsed.success) {
            const fieldErrors =
                parsed.error.flatten().fieldErrors;

            setErrors({
                label: fieldErrors.label?.[0],
                addressLine1:
                    fieldErrors.addressLine1?.[0],
                city: fieldErrors.city?.[0],
                state: fieldErrors.state?.[0],
                postalCode:
                    fieldErrors.postalCode?.[0],
                countryCode:
                    fieldErrors.countryCode?.[0],
            });

            return;
        }

        setErrors({});

        if (address) {
            const {
                ...data
            } = form;

            const payload: UpdateSellerAddressDto = {
                id: address.id,
                data,
            };

            await updateMutation.mutateAsync(payload);
        } else {
            const {
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
        errors,
        isSaving:
            createMutation.isPending ||
            updateMutation.isPending,
    };
}