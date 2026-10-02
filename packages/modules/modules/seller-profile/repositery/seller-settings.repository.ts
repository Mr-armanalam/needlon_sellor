import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { sellerSettings } from "@/db/schema/seller/seller-setting";
import { SellerSettingsDto, UpdateSellerSettingsDto } from "@/modules/seller-profile/dto";

type SellerSettingsRow = typeof sellerSettings.$inferSelect;

function toDto(row: SellerSettingsRow): SellerSettingsDto {
  return {
    sellerId: row.sellerId,

    languageCode: row.languageCode,
    currencyCode: row.currencyCode,
    timezone: row.timezone,

    theme: row.theme,

    emailNotifications: row.emailNotifications,
    smsNotifications: row.smsNotifications,
    pushNotifications: row.pushNotifications,

    marketingNotifications: row.marketingNotifications,
    orderNotifications: row.orderNotifications,
    payoutNotifications: row.payoutNotifications,
    lowInventoryNotifications: row.lowInventoryNotifications,
  };
}

async function findBySellerId(
  sellerId: string,
): Promise<SellerSettingsDto | null> {
  const row = await db.query.seller_settings.findFirst({
    where: and(eq(sellerSettings.sellerId, sellerId)),
  });

  if (!row) {
    return null;
  }

  return toDto(row);
}

async function createDefault(sellerId: string): Promise<SellerSettingsDto> {
  const [row] = await db
    .insert(sellerSettings)
    .values({
      sellerId,
    })
    .returning();

  return toDto(row);
}

async function update(
  sellerId: string,
  data: UpdateSellerSettingsDto,
): Promise<SellerSettingsDto> {
  const [row] = await db
    .update(sellerSettings)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(sellerSettings.sellerId, sellerId))
    .returning();

  return toDto(row);
}


export const sellerSettingsRepository = {
  findBySellerId,
  createDefault,
  update,
};

