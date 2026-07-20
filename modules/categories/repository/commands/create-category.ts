import { sql } from "drizzle-orm";
import { db } from "@/db";

export interface CreateCategoryParams {
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  level?: number;
}

export async function createCategory(data: CreateCategoryParams) {
  const rows = await db.execute(
    sql`INSERT INTO categories (name, slug, description, parent_id, level)
        VALUES (${data.name}, ${data.slug}, ${data.description ?? null}, ${data.parentId ?? null}, ${data.level ?? 0})
        RETURNING id, name, slug, description, parent_id as "parentId", level, created_at as "createdAt", updated_at as "updatedAt"`
  );

  return rows[0] as any;
}
