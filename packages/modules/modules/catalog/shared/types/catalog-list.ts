import { CatalogPagination } from "./catalog-pagination";

export interface CatalogList<T> {
    items: T[];

    pagination: CatalogPagination;
}