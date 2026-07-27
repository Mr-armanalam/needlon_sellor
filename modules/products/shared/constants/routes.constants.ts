export const PRODUCT_ROUTES = {
    ROOT: "/seller/products",

    CREATE: "/seller/products/create",

    DRAFT: "/seller/products/draft",

    DETAILS: "/seller/products/:id",

    EDIT: "/seller/products/:id/edit",

    PREVIEW: "/seller/products/:id/preview",
} as const;

export const PRODUCT_API = {
    ROOT: "/api/products",

    DRAFT: "/api/products/draft",

    SEARCH: "/api/products/search",

    MEDIA: "/api/products/media",

    INVENTORY: "/api/products/inventory",
} as const;