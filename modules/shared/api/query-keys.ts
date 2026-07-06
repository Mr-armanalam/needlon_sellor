export const queryKeys = {
    seller: {
        root: ["seller"] as const,

        profile: () => [
            ...queryKeys.seller.root,
            "profile",
        ] as const,

        store: () => [
            ...queryKeys.seller.root,
            "store",
        ] as const,

        addresses: () => [
            ...queryKeys.seller.root,
            "addresses",
        ] as const,

        bank: () => [
            ...queryKeys.seller.root,
            "bank",
        ] as const,

        settings: () => [
            ...queryKeys.seller.root,
            "settings",
        ] as const,

        verification: {
            root: () => [
                ...queryKeys.seller.root,
                "verification",
            ] as const,

            documents: () => [
                ...queryKeys.seller.root,
                "verification",
                "documents",
            ] as const,

            document: (
                documentId: string,
            ) => [
                ...queryKeys.seller.root,
                "verification",
                "documents",
                documentId,
            ] as const,
        },
    },
};