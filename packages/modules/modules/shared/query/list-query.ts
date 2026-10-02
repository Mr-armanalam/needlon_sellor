// import {SortParams} from "@/modules/shared/query/sorting";
// import {PaginationParams} from "@/modules/shared/query/pagination";
//
// export interface ListQuery<
//     TSortField extends string,
// > {
//     pagination: PaginationParams;
//
//     sorting?: SortParams<TSortField>;
//
//     search?: string;
// }


export interface ListQuery<
    TSortField extends string = string,
    TFilter = unknown,
> {
    page?: number;

    limit?: number;

    search?: string;

    sort?: {
        field: TSortField;

        direction: "asc" | "desc";
    };

    filters?: TFilter;
}