export interface FilterDto {
    field: string;
    value: unknown;
}

export interface SearchDto {
    query?: string;
}

export interface DateRangeDto {
    from?: string;
    to?: string;
}