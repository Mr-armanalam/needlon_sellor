import { SellerSettingsDto } from "@/modules/dto";
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
