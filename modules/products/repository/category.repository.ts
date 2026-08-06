import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { categoriesTable, Category } from "@/db/schema/catalog/categories";

export interface CategoryListOptions {
    parentId?: string | null;
    includeInactive?: boolean;
}

export async function findCategoryById(id: string): Promise<Category | null> {
    const [category] = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, id))
        .limit(1);

    return category ?? null;
}

export async function findCategoryBySlug(slug: string): Promise<Category | null> {
    const [category] = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.slug, slug))
        .limit(1);

    return category ?? null;
}

export async function findRootCategories(): Promise<Category[]> {
    return db
        .select()
        .from(categoriesTable)
        .where(isNull(categoriesTable.parentId));
}

export async function findChildCategories(parentId: string): Promise<Category[]> {
    return db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.parentId, parentId));
}

export async function listCategories(options?: CategoryListOptions): Promise<Category[]> {
    const conditions = [];

    if (options?.parentId !== undefined) {
        if (options.parentId === null) {
            conditions.push(isNull(categoriesTable.parentId));
        } else {
            conditions.push(eq(categoriesTable.parentId, options.parentId));
        }
    }

    if (!options?.includeInactive) {
        conditions.push(eq(categoriesTable.status, "ACTIVE"));
    }

    if (conditions.length === 0) {
        return db.select().from(categoriesTable);
    }

    return db
        .select()
        .from(categoriesTable)
        .where(and(...conditions));
}

export async function categoryExists(id: string): Promise<boolean> {
    const category = await findCategoryById(id);
    return category !== null;
}
