import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { pricingTable } from "./table";

/**
 * ============================================================
 * Pricing Database Types
 * ============================================================
 */

export type Pricing =
    InferSelectModel<typeof pricingTable>;

export type NewPricing =
    InferInsertModel<typeof pricingTable>;

/**
 * Primary Key
 */

export type PricingId = Pricing["id"];

/**
 * Public metadata exports.
 */

export type {
    PricingMetadata,
    PricingImportMetadata,
    PricingCampaignMetadata,
    PricingAiMetadata,
} from "./metadata";