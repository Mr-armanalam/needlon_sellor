import { SellerTheme } from "../types";

export interface SellerSettingsDto {
  sellerId: string;

  languageCode: string;
  currencyCode: string;
  timezone: string;

  theme: SellerTheme;

  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;

  marketingNotifications: boolean;
  orderNotifications: boolean;
  payoutNotifications: boolean;
  lowInventoryNotifications: boolean;
}
