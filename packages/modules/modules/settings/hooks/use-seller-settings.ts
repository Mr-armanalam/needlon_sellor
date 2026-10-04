"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/modules/shared/api/query-keys";
import { getSellerSettings } from "@/modules/seller-profile/api/get-seller-settings";
import { updateSellerSettings } from "@/modules/seller-profile/api/update-seller-settings";
import { SellerSettingsDto, UpdateSellerSettingsDto } from "@/modules/seller-profile/dto";
import { toast } from "sonner";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English (US)", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇦🇪" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
];

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "AU$", name: "Australian Dollar" },
];

export const SUPPORTED_TIMEZONES: TimezoneOption[] = [
  { value: "Asia/Kolkata", label: "India Standard Time (IST)", offset: "UTC+05:30" },
  { value: "UTC", label: "Coordinated Universal Time (UTC)", offset: "UTC+00:00" },
  { value: "America/New_York", label: "Eastern Time (US & Canada)", offset: "UTC-05:00" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)", offset: "UTC-08:00" },
  { value: "Europe/London", label: "Greenwich Mean Time / BST", offset: "UTC+00:00" },
  { value: "Europe/Paris", label: "Central European Time", offset: "UTC+01:00" },
  { value: "Asia/Dubai", label: "Gulf Standard Time", offset: "UTC+04:00" },
  { value: "Asia/Singapore", label: "Singapore Time", offset: "UTC+08:00" },
  { value: "Asia/Tokyo", label: "Japan Standard Time", offset: "UTC+09:00" },
];

export function useSellerSettings() {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: queryKeys.seller.settings(),
    queryFn: getSellerSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const mutation = useMutation({
    mutationFn: (payload: UpdateSellerSettingsDto) => updateSellerSettings(payload),
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.seller.settings() });
      const previousSettings = queryClient.getQueryData<SellerSettingsDto>(queryKeys.seller.settings());

      if (previousSettings) {
        queryClient.setQueryData<SellerSettingsDto>(queryKeys.seller.settings(), {
          ...previousSettings,
          ...newSettings,
        });
      }

      return { previousSettings };
    },
    onError: (err, _newSettings, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(queryKeys.seller.settings(), context.previousSettings);
      }
      toast.error(err instanceof Error ? err.message : "Failed to update settings");
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.seller.settings(), data);
      toast.success("Settings saved successfully!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.seller.settings() });
    },
  });

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    isError: settingsQuery.isError,
    error: settingsQuery.error,
    refetch: settingsQuery.refetch,
    updateSettings: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
