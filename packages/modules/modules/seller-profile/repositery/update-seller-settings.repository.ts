import { eq } from "drizzle-orm";

import { db } from "@/db";
import { UpdateSellerSettingsDto } from "@/modules/seller-profile/dto";
import { sellerSettings } from "@/db/schema/seller/seller-setting";


export async function updateSellerSettings(
  sellerId: string,
  data: UpdateSellerSettingsDto,
) {
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (data.languageCode !== undefined) updateData.languageCode = data.languageCode;
  if (data.currencyCode !== undefined) updateData.currencyCode = data.currencyCode;
  if (data.timezone !== undefined) updateData.timezone = data.timezone;
  if (data.theme !== undefined) updateData.theme = data.theme;
  if (data.emailNotifications !== undefined) updateData.emailNotifications = data.emailNotifications;
  if (data.smsNotifications !== undefined) updateData.smsNotifications = data.smsNotifications;
  if (data.pushNotifications !== undefined) updateData.pushNotifications = data.pushNotifications;
  if (data.marketingNotifications !== undefined) updateData.marketingNotifications = data.marketingNotifications;
  if (data.orderNotifications !== undefined) updateData.orderNotifications = data.orderNotifications;
  if (data.payoutNotifications !== undefined) updateData.payoutNotifications = data.payoutNotifications;
  if (data.lowInventoryNotifications !== undefined) updateData.lowInventoryNotifications = data.lowInventoryNotifications;

  const [settings] = await db
    .update(sellerSettings)
    .set(updateData)
    .where(eq(sellerSettings.sellerId, sellerId))
    .returning();

  return settings ?? null;
}