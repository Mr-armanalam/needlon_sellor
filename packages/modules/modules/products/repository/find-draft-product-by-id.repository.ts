import { eq } from "drizzle-orm";
import { db } from "@/db";
import { productsTable, Product } from "@/db/schema/catalog/products";

export async function findProductById(id: string): Promise<Product | null> {
    const [product] = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, id))
        .limit(1);

    return product ?? null;
}

export async function findDraftProductById(id: string): Promise<Product | null> {
    return findProductById(id);
}
