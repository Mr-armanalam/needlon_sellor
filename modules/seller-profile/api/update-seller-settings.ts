import { SellerSettingsDto, UpdateSellerSettingsDto } from "@/modules/dto";

interface UpdateSellerSettingsResponse {
  success: boolean;
  data: SellerSettingsDto;
  error?: string;
}

export async function updateSellerSettings(
  payload: UpdateSellerSettingsDto,
): Promise<SellerSettingsDto> {
  const response = await fetch("/api/seller/settings", {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result =
    (await response.json()) as UpdateSellerSettingsResponse;

  if (!response.ok) {
    throw new Error(result.error ?? "Failed to update seller settings.");
  }

  return result.data;
}