import { sql } from "drizzle-orm";
import { db } from "@/db";

export async function deleteCategory(id: string) {
  const rows = await db.execute(
    sql`DELETE FROM categories WHERE id = ${id} RETURNING id, name`
  );

  return rows[0] as any;
}
