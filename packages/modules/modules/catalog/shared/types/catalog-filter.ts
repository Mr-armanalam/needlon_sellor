import { CatalogStatus } from "./catalog-status";

export interface CatalogFilter {
    search?: string;

    status?: CatalogStatus;

    page?: number;

    pageSize?: number;
}