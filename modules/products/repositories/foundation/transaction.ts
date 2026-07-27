import { db } from "@/db";

export async function withTransaction<T>(
    callback: Parameters<typeof db.transaction>[0],
) {
    return db.transaction(callback);
}