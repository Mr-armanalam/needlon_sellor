export type SortDirection =
    | "asc"
    | "desc";

export interface SortOptions {

    field: string;

    direction: SortDirection;
}

export function normalizeSort(
    sort?: Partial<SortOptions>,
): SortOptions {

    return {

        field:
            sort?.field ?? "createdAt",

        direction:
            sort?.direction ?? "desc",
    };
}