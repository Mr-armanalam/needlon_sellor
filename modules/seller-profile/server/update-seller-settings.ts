import { UpdateSellerSettingsDto } from "@/modules/dto";
import { updateSellerSettings } from "../repositery/update-seller-settings.repository";
import { toSellerSettingsDto } from "../mapper/seller-settings.mapper";
import { createSellerSettingsService } from "../repositery/create-seller-settings.repository";

export async function updateSellerSettingsService(
  sellerId: string,
  data: UpdateSellerSettingsDto,
) {
  const settings = await updateSellerSettings(sellerId, data);

  if (!settings) {
    const newSettings = await createSellerSettingsService(
      sellerId,
      data,
    );
    return toSellerSettingsDto(newSettings);
  }

  return toSellerSettingsDto(settings);
}
