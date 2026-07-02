export const sellerSettingsKeys = {
  all: ["seller-settings"] as const,

  detail: () => [...sellerSettingsKeys.all, "detail"] as const,
};