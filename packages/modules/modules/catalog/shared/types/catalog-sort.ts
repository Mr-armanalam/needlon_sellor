export type CatalogSortDirection =
    "asc"
    | "desc";

export interface CatalogSort {
    field: string;

    direction: CatalogSortDirection;
}