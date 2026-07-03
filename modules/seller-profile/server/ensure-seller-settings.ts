import { SellerSettingsDto } from "@/modules/seller-profile/dto";
import { sellerSettingsRepository } from "../repositery/seller-settings.repository";

export async function ensureSellerSettings(
  sellerId: string,
): Promise<SellerSettingsDto> {
  const existingSettings =
    await sellerSettingsRepository.findBySellerId(sellerId);

  if (existingSettings) {
    return existingSettings;
  }

  return sellerSettingsRepository.createDefault(sellerId);
}
