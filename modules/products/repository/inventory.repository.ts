import { db } from "@/db";
import { inventoryTable as inventory } from "@/db/schema/catalog/products/inventory/table";
import { productVariantsTable as variants } from "@/db/schema/catalog/products/product-variants/table";
import { productsTable as products } from "@/db/schema/catalog/products/table";
import { and, eq, sql, lte, isNull, inArray } from "drizzle-orm";
import { UpdateInventoryStockDto, AdjustStockDto } from "../dto/inventory.dto";

type DbOrTransaction = typeof db;

export async function upsertInventory(dto: UpdateInventoryStockDto, tx?: DbOrTransaction) {
  const database = tx || db;
  const existing = await database
    .select()
    .from(inventory)
    .where(eq(inventory.variantId, dto.variantId))
    .limit(1);

  if (existing.length > 0) {
    const updatePayload: Record<string, unknown> = {
      quantity: dto.quantity,
      lastAdjustedAt: new Date(),
      updatedAt: new Date(),
    };
    if (dto.reservedQuantity !== undefined) updatePayload.reservedQuantity = dto.reservedQuantity;
    if (dto.lowStockThreshold !== undefined) updatePayload.lowStockThreshold = dto.lowStockThreshold;
    if (dto.allowBackorder !== undefined) updatePayload.allowBackorder = dto.allowBackorder;

    const [updated] = await database
      .update(inventory)
      .set(updatePayload)
      .where(eq(inventory.variantId, dto.variantId))
      .returning();
    return updated;
  } else {
    const [inserted] = await database
      .insert(inventory)
      .values({
        variantId: dto.variantId,
        quantity: dto.quantity,
        reservedQuantity: dto.reservedQuantity ?? 0,
        lowStockThreshold: dto.lowStockThreshold ?? 5,
        allowBackorder: dto.allowBackorder ?? false,
        lastAdjustedAt: new Date(),
      })
      .returning();
    return inserted;
  }
}

export async function adjustInventoryStock(dto: AdjustStockDto, tx?: DbOrTransaction) {
  const database = tx || db;
  const [updated] = await database
    .update(inventory)
    .set({
      quantity: sql`GREATEST(0, ${inventory.quantity} + ${dto.adjustment})`,
      lastAdjustedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(inventory.variantId, dto.variantId))
    .returning();
  return updated;
}

export async function reserveStock(variantId: string, qty: number, tx?: DbOrTransaction) {
  const database = tx || db;
  const [updated] = await database
    .update(inventory)
    .set({
      reservedQuantity: sql`COALESCE(${inventory.reservedQuantity}, 0) + ${qty}`,
      updatedAt: new Date(),
    })
    .where(eq(inventory.variantId, variantId))
    .returning();
  return updated;
}

export async function releaseStock(variantId: string, qty: number, deductPhysical: boolean = false, tx?: DbOrTransaction) {
  const database = tx || db;
  const updatePayload: Record<string, unknown> = {
    reservedQuantity: sql`GREATEST(0, COALESCE(${inventory.reservedQuantity}, 0) - ${qty})`,
    updatedAt: new Date(),
  };
  if (deductPhysical) {
    updatePayload.quantity = sql`GREATEST(0, ${inventory.quantity} - ${qty})`;
  }

  const [updated] = await database
    .update(inventory)
    .set(updatePayload)
    .where(eq(inventory.variantId, variantId))
    .returning();
  return updated;
}

export async function getSellerInventory(sellerId: string, options?: { lowStockOnly?: boolean; search?: string }) {
  const conditions = [
    eq(products.storeId, sellerId),
    isNull(products.deletedAt),
  ];

  if (options?.lowStockOnly) {
    conditions.push(sql`${inventory.quantity} <= COALESCE(${inventory.lowStockThreshold}, 5)`);
  }

  const rows = await db
    .select({
      id: inventory.id,
      variantId: variants.id,
      variantName: variants.name,
      sku: variants.sku,
      productName: products.name,
      quantity: inventory.quantity,
      reservedQuantity: inventory.reservedQuantity,
      lowStockThreshold: inventory.lowStockThreshold,
      allowBackorder: inventory.allowBackorder,
      lastAdjustedAt: inventory.lastAdjustedAt,
    })
    .from(variants)
    .innerJoin(products, eq(variants.productId, products.id))
    .leftJoin(inventory, eq(inventory.variantId, variants.id))
    .where(and(...conditions));

  return rows.map((r) => {
    const qty = r.quantity ?? 0;
    const reserved = r.reservedQuantity ?? 0;
    const threshold = r.lowStockThreshold ?? 5;
    return {
      id: r.id || r.variantId,
      variantId: r.variantId,
      variantName: r.variantName,
      sku: r.sku,
      productName: r.productName,
      quantity: qty,
      reservedQuantity: reserved,
      availableQuantity: Math.max(0, qty - reserved),
      lowStockThreshold: threshold,
      allowBackorder: !!r.allowBackorder,
      isLowStock: qty <= threshold,
      lastAdjustedAt: r.lastAdjustedAt ? r.lastAdjustedAt.toISOString() : null,
    };
  });
}
