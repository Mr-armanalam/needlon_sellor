import { asc, desc } from "drizzle-orm";

export function buildSort(
    column: any,
    direction: "asc" | "desc" = "desc",
) {
    return direction === "asc"
        ? asc(column)
        : desc(column);
}