export const sellerSettingsKeys = {
  all: ["seller-settings"] as const,

  detail: () => [...sellerSettingsKeys.all, "detail"] as const,
};

export const sellerAddressKeys = {
  all: ["seller-addresses"] as const,

  list: () =>
      [...sellerAddressKeys.all, "list"] as const,

  detail: (id: string) =>
      [...sellerAddressKeys.all, id] as const,
};

export const sellerProfileKeys = {
  all: ["seller-profile"] as const,

  profile: () =>
      [...sellerProfileKeys.all, "profile"] as const,
};


export const sellerStoreKeys = {
  all: ["seller-store"] as const,

  store: () =>
      [...sellerStoreKeys.all, "store"] as const,
};

