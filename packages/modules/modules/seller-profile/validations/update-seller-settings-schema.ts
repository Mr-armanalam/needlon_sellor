
import { z } from "zod";
import { SELLER_THEMES } from "../constants";

const sellerThemeSchema = z.enum(SELLER_THEMES);

export const updateSellerSettingsSchema = z.object({
  languageCode: z.string().trim().min(2).max(10),

  currencyCode: z.string().trim().length(3),

  timezone: z.string().trim().min(1).max(100),

  theme: sellerThemeSchema,

  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),

  marketingNotifications: z.boolean(),
  orderNotifications: z.boolean(),
  payoutNotifications: z.boolean(),
  lowInventoryNotifications: z.boolean(),
});

export type UpdateSellerSettingsInput = z.infer<
  typeof updateSellerSettingsSchema
>;



// import { z } from "zod";

// export const updateSellerSettingsSchema = z.object({
//   languageCode: z.string().trim().min(2).max(10),

//   timezone: z.string().trim().min(1).max(100),

//   theme: z.enum(["LIGHT", "DARK", "SYSTEM", "HIGH_CONTRAST"]),

//   emailNotifications: z.boolean(),

//   smsNotifications: z.boolean(),

//   pushNotifications: z.boolean(),

//   marketingNotifications: z.boolean(),

//   orderNotifications: z.boolean(),

//   payoutNotifications: z.boolean(),

//   lowInventoryNotifications: z.boolean(),
// });