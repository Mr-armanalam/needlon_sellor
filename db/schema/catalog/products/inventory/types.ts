import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { inventoryTable } from "./table";

/**
 * ============================================================
 * Inventory Database Types
 * ============================================================
 */

export type Inventory =
    InferSelectModel<typeof inventoryTable>;

export type NewInventory =
    InferInsertModel<typeof inventoryTable>;

/**
 * Primary Key
 */

export type InventoryId = Inventory["id"];

/**
 * Public metadata exports.
 */

export type {
    InventoryMetadata,
    InventoryImportMetadata,
    InventorySyncMetadata,
    InventoryAiMetadata,
} from "./metadata";