// ============================================================================
// Needlon
// Reviews Module
// File: db/schema/reviews/table.ts
// Description: Seller ownership relationship
// Phase: 1.5 - Add seller ownership relationship
// ============================================================================

import {
    uuid,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

/**
 * ============================================================================
 * Seller Ownership
 * ============================================================================
 *
 * Every review belongs to exactly one seller.
 *
 * The seller relationship is enforced at the database level through the
 * foreign key constraint.
 *
 * Seller deletion is restricted while reviews reference the seller.
 * Seller identifier changes cascade to the review ownership reference.
 * ============================================================================
 */

export const reviewSellerOwnershipColumn = {
    sellerId: uuid("seller_id")
        .notNull()
        .references(
            () => seller.id,
            {
                onDelete: "restrict",
                onUpdate: "cascade",
            },
        ),
} as const;


// ============================================================================
// Needlon
// Reviews Module
// File: db/schema/reviews/table.ts
// Description: Buyer relationship
// Phase: 1.6 - Add buyer relationship
// ============================================================================


import { usersTable } from "@/db/schema/users";

/**
 * ============================================================================
 * Buyer Relationship
 * ============================================================================
 *
 * Every review belongs to one Buyer.
 *
 * The Buyer is the customer who discovers, views, and purchases products
 * listed by Sellers on Needlon.
 *
 * The relationship is enforced through a database foreign key.
 * ============================================================================
 */

export const reviewBuyerRelationshipColumn = {
    buyerId: uuid("buyer_id")
        .notNull()
        .references(
            () => usersTable.id,
            {
                onDelete: "restrict",
                onUpdate: "cascade",
            },
        ),
} as const;

// ============================================================================
// COMPLETED
// ============================================================================

export const REVIEWS_IMPLEMENTATION_PROGRESS = {
    completed: [
        "1.1 Create db/schema/reviews/constants.ts",
        "1.2 Create db/schema/reviews/types.ts",
        "1.3 Create db/schema/reviews/metadata.ts",
        "1.4 Create db/schema/reviews/table.ts",
        "1.5 Add seller ownership relationship",
        "1.6 Add buyer relationship",
    ] as const,

    current:
        "1.6 Add buyer relationship",

    next:
        "1.7 Add product relationship",
} as const;

// ============================================================================
// NEXT STEP
// ============================================================================

export const NEXT_STEP =
    "1.7 Add product relationship";
