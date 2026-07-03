"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { SellerAddressForm } from "../types/seller-address-form";
import { CreateSellerAddressDto } from "../dto/seller-address.dto";
import { UpdateSellerAddressDto } from "../dto/seller-address.dto";

import { useCreateSellerAddressMutation } from "./use-create-seller-address";
import { useUpdateSellerAddressMutation } from "./use-update-seller-address";
import { useDeleteSellerAddressMutation } from "./use-delete-seller-address";
import { useSetDefaultSellerAddressMutation } from "./use-set-default-seller-address";
import {useSellerAddressesQuery} from "@/modules/seller-profile/hooks/use-seller-address-query";

function cloneAddress(
    address: SellerAddressForm,
): SellerAddressForm {
    return structuredClone(address);
}

export function useSellerAddressForm() {
    const query = useSellerAddressesQuery();

    const createMutation =
        useCreateSellerAddressMutation();

    const updateMutation =
        useUpdateSellerAddressMutation();

    const deleteMutation =
        useDeleteSellerAddressMutation();

    const setDefaultMutation =
        useSetDefaultSellerAddressMutation();

    const [addresses, setAddresses] = useState<
        SellerAddressForm[]
    >([]);

    useEffect(() => {
        if (!query.data) return;

        setAddresses(
            query.data.map(cloneAddress),
        );
    }, [query.data]);

    const create = useCallback(
        async (
            input: CreateSellerAddressDto,
        ) => {
            await createMutation.mutateAsync(input);
        },
        [createMutation],
    );

    const update = useCallback(
        async (
            input: UpdateSellerAddressDto,
        ) => {
            await updateMutation.mutateAsync(input);
        },
        [updateMutation],
    );

    const remove = useCallback(
        async (id: string) => {
            await deleteMutation.mutateAsync(id);
        },
        [deleteMutation],
    );

    const setDefault = useCallback(
        async (id: string) => {
            await setDefaultMutation.mutateAsync(id);
        },
        [setDefaultMutation],
    );


    const defaultAddress = useMemo(
        () =>
            addresses.find(
                (a) => a.isDefault,
            ) ?? null,
        [addresses],
    );


    return {
        addresses,
        defaultAddress,

        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,

        isCreating:
        createMutation.isPending,

        isUpdating:
        updateMutation.isPending,

        isDeleting:
        deleteMutation.isPending,

        isSettingDefault:
        setDefaultMutation.isPending,

        create,
        update,
        remove,
        setDefault,

        refetch: query.refetch,
    };
}