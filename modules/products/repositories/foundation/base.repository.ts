import {
    getPagination,
} from "./pagination";

import {
    PaginationOptions,
} from "./repository.types";

export abstract class BaseRepository {
    protected paginate(
        options?: PaginationOptions,
    ) {
        return getPagination(options);
    }
}