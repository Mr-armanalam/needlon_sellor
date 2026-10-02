import {AnyColumn, isNull} from "drizzle-orm";

export function notDeleted(
    deletedAt: AnyColumn,
) {
    return isNull(deletedAt);
}