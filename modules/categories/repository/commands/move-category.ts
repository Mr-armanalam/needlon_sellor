import { sql } from "drizzle-orm";
import { db } from "@/db";

interface MoveCategoryParams {
  categoryId: string;
  newParentId: string | null;
  newLevel: number;
}

export async function moveCategory({
  categoryId,
  newParentId,
  newLevel,
}: MoveCategoryParams) {
  const rows = await db.execute(
    sql`UPDATE categories
        SET parent_id = ${newParentId},
            level = ${newLevel},
            updated_at = now()
        WHERE id = ${categoryId}
        RETURNING id, name, slug, description, parent_id as "parentId", level, created_at as "createdAt", updated_at as "updatedAt"`
  );

  return rows[0] as any;
}
