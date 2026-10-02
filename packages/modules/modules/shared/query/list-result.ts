import {PaginationResult} from "@/modules/shared/query/pagination-result";

export interface ListResult<T>{

    data:T[];

    pagination:PaginationResult;

}