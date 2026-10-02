import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { shippingTable } from "./table";

/**
 * ============================================================
 * Shipping Database Types
 * ============================================================
 */

export type Shipping =
    InferSelectModel<typeof shippingTable>;

export type NewShipping =
    InferInsertModel<typeof shippingTable>;

/**
 * Primary Key
 */

export type ShippingId = Shipping["id"];

/**
 * Public metadata exports.
 */

export type {
    ShippingMetadata,
    ShippingPackagingMetadata,
    ShippingCarrierMetadata,
    ShippingAiMetadata,
} from "./metadata";