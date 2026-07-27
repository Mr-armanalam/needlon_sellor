import { SQL, and } from "drizzle-orm";

export function buildWhere(
    conditions: (SQL | undefined)[],
) {
    return and(
        ...conditions.filter(
            Boolean,
        ) as SQL[],
    );
}