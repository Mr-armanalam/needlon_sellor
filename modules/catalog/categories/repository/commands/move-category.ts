import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema/catalog/categories";

interface MoveCategoryParams {
    categoryId: string;
    oldPath: string;
    oldLevel: number;
    newParentId: string | null;
    newPath: string;
    newLevel: number;
}

/**
 * Reparents a categories and cascades the path/level change to every
 * descendant, in a single transaction.
 *
 * Cycle prevention, "does the new parent exist", etc. are business
 * rules and belong in move-categories.service.ts — this command just
 * performs the write, same convention as create-categories.ts.
 */
export async function moveCategory({
                                       categoryId,
                                       oldPath,
                                       oldLevel,
                                       newParentId,
                                       newPath,
                                       newLevel,
                                   }: MoveCategoryParams) {

    return db.transaction(async (tx) => {

        const [category] = await tx
            .update(categories)
            .set({
                parentId: newParentId,
                path: newPath,
                level: newLevel,
                updatedAt: new Date(),
            })
            .where(eq(categories.id, categoryId))
            .returning();

        const oldSubtreePrefix = `${oldPath}${categoryId}/`;
        const newSubtreePrefix = `${newPath}${categoryId}/`;
        const levelDelta = newLevel - oldLevel;

        // Cascade to descendants only (the moved categories itself was
        // already updated above, and its new path no longer matches
        // oldSubtreePrefix, so this WHERE can't double-update it).
        await tx.execute(sql`
            UPDATE categories
            SET
                path = ${newSubtreePrefix} || substring(path from ${oldSubtreePrefix.length + 1}),
                level = level + ${levelDelta},
                updated_at = now()
            WHERE path LIKE ${oldSubtreePrefix + "%"}
        `);

        return category;

    });

}