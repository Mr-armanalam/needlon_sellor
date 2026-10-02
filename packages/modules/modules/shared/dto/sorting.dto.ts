export type SortDirection = "asc" | "desc";

export interface SortDto {
    field: string;
    direction: SortDirection;
}