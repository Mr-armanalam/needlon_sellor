export type ProductStatus =

    | "draft"

    | "active"

    | "archived"

    | "out_of_stock";

export function isPublished(
    status: ProductStatus,
) {
    return status === "active";
}

export function isDraft(
    status: ProductStatus,
) {
    return status === "draft";
}