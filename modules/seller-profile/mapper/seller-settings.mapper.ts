import { sellerSettings } from "@/db/schema/seller/seller-setting";
import { SellerSettingsDto } from "@/modules/dto";
import { InferSelectModel } from "drizzle-orm";

type SellerSettingsEntity = InferSelectModel<typeof sellerSettings>;

export function toSellerSettingsDto(
  entity: SellerSettingsEntity,
): SellerSettingsDto {
  return {
    sellerId: entity.sellerId,

    languageCode: entity.languageCode,
    currencyCode: entity.currencyCode,
    timezone: entity.timezone,

    theme: entity.theme,

    emailNotifications: entity.emailNotifications,
    smsNotifications: entity.smsNotifications,
    pushNotifications: entity.pushNotifications,

    marketingNotifications: entity.marketingNotifications,
    orderNotifications: entity.orderNotifications,
    payoutNotifications: entity.payoutNotifications,
    lowInventoryNotifications: entity.lowInventoryNotifications,
  };
}
