export interface SortParams<T extends string> {
    field: T;
    direction: "asc" | "desc";
}