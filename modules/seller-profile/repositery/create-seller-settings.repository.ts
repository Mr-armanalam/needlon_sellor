
import { db } from "@/db";
import { UpdateSellerSettingsDto } from "@/modules/dto";
import { sellerSettings } from "@/db/schema/seller/seller-setting";

export async function createSellerSettingsService(
  sellerId: string,
  data: UpdateSellerSettingsDto,
) {
  const [settings] = await db
    .insert(sellerSettings)
    .values({
      sellerId,
      languageCode: data.languageCode,
      currencyCode: data.currencyCode,
      timezone: data.timezone,

      theme: data.theme,

      emailNotifications: data.emailNotifications,
      smsNotifications: data.smsNotifications,
      pushNotifications: data.pushNotifications,

      marketingNotifications: data.marketingNotifications,
      orderNotifications: data.orderNotifications,
      payoutNotifications: data.payoutNotifications,
      lowInventoryNotifications: data.lowInventoryNotifications,

      updatedAt: new Date(),
    })
    .returning();

  return settings ?? null;
}
