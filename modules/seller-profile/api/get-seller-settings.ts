import { SellerSettingsDto } from "@/modules/dto";

interface GetSellerSettingsResponse {
  success: boolean;
  data: SellerSettingsDto;
  error?: string;
}

export async function getSellerSettings(): Promise<SellerSettingsDto> {
  const response = await fetch("/api/seller/settings", {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const result =
    (await response.json()) as GetSellerSettingsResponse;

  if (!response.ok) {
    throw new Error(result.error ?? "Failed to load seller settings.");
  }

  return result.data;
}