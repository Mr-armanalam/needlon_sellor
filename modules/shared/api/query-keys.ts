export const queryKeys = {
    seller: {
        root: ["seller"] as const,

        settings: () =>
            [...queryKeys.seller.root, "settings"] as const,

        addresses: () =>
            [...queryKeys.seller.root, "addresses"] as const,

        profile: () =>
            [...queryKeys.seller.root, "profile"] as const,

        bank: () =>
            [...queryKeys.seller.root, "bank"] as const,
    },
};


