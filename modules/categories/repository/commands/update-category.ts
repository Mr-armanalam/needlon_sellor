import { sql } from "drizzle-orm";
import { db } from "@/db";

export interface UpdateCategoryParams {
  id: string;
  data: {
    name?: string;
    slug?: string;
    description?: string | null;
    parentId?: string | null;
  };
}

export async function updateCategory({ id, data }: UpdateCategoryParams) {
  const nameVal = data.name ?? null;
  const slugVal = data.slug ?? null;
  const descVal = data.description ?? null;
  const parentVal = data.parentId ?? null;

  const rows = await db.execute(
    sql`UPDATE categories
        SET
          name = COALESCE(${nameVal}, name),
          slug = COALESCE(${slugVal}, slug),
          description = COALESCE(${descVal}, description),
          parent_id = COALESCE(${parentVal}, parent_id),
          updated_at = now()
        WHERE id = ${id}
        RETURNING id, name, slug, description, parent_id as "parentId", level, created_at as "createdAt", updated_at as "updatedAt"`
  );

  return rows[0] as any;
}
