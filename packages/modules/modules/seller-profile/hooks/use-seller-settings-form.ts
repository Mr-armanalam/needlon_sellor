"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useSellerSettingsQuery } from "./use-seller-settings-query";
import { SellerSettingsForm } from "../types/seller-setting-form";
import { useUpdateSellerSettingsMutation } from "./use-update-seller-settings";

function createForm(data: SellerSettingsForm): SellerSettingsForm {
  return {
    ...data,
  };
}

export function useSellerSettingsForm() {
  const query = useSellerSettingsQuery();
  const mutation = useUpdateSellerSettingsMutation();

  const [form, setForm] = useState<SellerSettingsForm | null>(null);

  const [initialForm, setInitialForm] = useState<SellerSettingsForm | null>(
    null,
  );

  const save = useCallback(async () => {
    if (!form) {
      return;
    }

    const updated = await mutation.mutateAsync(form);

    const snapshot = createForm(updated);

    setForm(snapshot);
    setInitialForm(snapshot);
  }, [form, mutation]);

  useEffect(() => {
    if (!query.data) return;

    const value = createForm(query.data);

    // Defer state updates to avoid synchronous setState within the effect
    // which can trigger cascading renders.
    Promise.resolve().then(() => {
      setForm(value);
      setInitialForm(value);
    });
  }, [query.data]);

  const setField = useCallback(
    <K extends keyof SellerSettingsForm>(
      key: K,
      value: SellerSettingsForm[K],
    ) => {
      setForm((previous) => {
        if (!previous) return previous;

        return {
          ...previous,
          [key]: value,
        };
      });
    },
    [],
  );

  const toggleField = useCallback(
    (
      key: {
        [K in keyof SellerSettingsForm]: SellerSettingsForm[K] extends boolean
          ? K
          : never;
      }[keyof SellerSettingsForm],
    ) => {
      setForm((previous) => {
        if (!previous) return previous;

        return {
          ...previous,
          [key]: !previous[key],
        };
      });
    },
    [],
  );

  const reset = useCallback(() => {
    if (!initialForm) return;

    setForm(createForm(initialForm));
  }, [initialForm]);

  const isDirty = useMemo(() => {
    if (!form || !initialForm) {
      return false;
    }

    return JSON.stringify(form) !== JSON.stringify(initialForm);
  }, [form, initialForm]);

  return {
    form,

    isLoading: query.isLoading,
    isFetching: query.isFetching,

    isSaving: mutation.isPending,

    isError: query.isError,
    error: query.error,

    isDirty,

    setField,
    toggleField,

    reset,
    save,
  };
}
