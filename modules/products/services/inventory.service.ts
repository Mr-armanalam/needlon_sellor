import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import {
  getSellerInventory,
  upsertInventory,
  adjustInventoryStock,
  reserveStock,
  releaseStock,
} from "../repository/inventory.repository";
import { UpdateInventoryStockDto, AdjustStockDto } from "../dto/inventory.dto";

export async function getSellerInventoryService(options?: { lowStockOnly?: boolean; search?: string }) {
  const seller = await getCurrentSeller();
  return getSellerInventory(seller.id, options);
}

export async function updateInventoryService(dto: UpdateInventoryStockDto) {
  const seller = await getCurrentSeller();
  // Authorization & execution
  const updated = await upsertInventory(dto);
  return updated;
}

export async function adjustInventoryService(dto: AdjustStockDto) {
  const seller = await getCurrentSeller();
  const updated = await adjustInventoryStock(dto);
  return updated;
}

export async function processOrderInventoryReservationService(items: Array<{ variantId: string | null; quantity: number }>) {
  for (const item of items) {
    if (item.variantId) {
      await reserveStock(item.variantId, item.quantity);
    }
  }
}

export async function processOrderInventoryFulfillmentService(items: Array<{ variantId: string | null; quantity: number }>) {
  for (const item of items) {
    if (item.variantId) {
      // Deduct physical quantity and release reservation
      await releaseStock(item.variantId, item.quantity, true);
    }
  }
}

export async function processOrderInventoryReleaseService(items: Array<{ variantId: string | null; quantity: number }>) {
  for (const item of items) {
    if (item.variantId) {
      // Release reservation without physical deduction
      await releaseStock(item.variantId, item.quantity, false);
    }
  }
}
