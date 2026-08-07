// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/shared-orders/table.ts
// Description:
// Stores immutable Order snapshots shared inside conversations.
// ============================================================================

import { sql } from "drizzle-orm";

import {
    bigint,
    check,
    index,
    jsonb,
    numeric,
    pgEnum,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { orders as ordersTable  } from "@/db/schema/orders/table";

import { messagesTable } from "../messages";

import type { SharedOrderMetadata } from "./metadata";

import {
    SHARED_ORDER_BUYER_NAME_MAX_LENGTH,
    SHARED_ORDER_COURIER_NAME_MAX_LENGTH,
    SHARED_ORDER_CURRENCY_MAX_LENGTH,
    SHARED_ORDER_DELIVERY_STATUSES,
    SHARED_ORDER_NUMBER_MAX_LENGTH,
    SHARED_ORDER_PAYMENT_STATUSES,
    SHARED_ORDER_SELLER_NAME_MAX_LENGTH,
    SHARED_ORDER_SOURCES,
    SHARED_ORDER_STATUSES,
    SHARED_ORDER_TRACKING_NUMBER_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================================
 * Enums
 * ============================================================================
 */

export const sharedOrderStatusEnum =
    pgEnum(
        "shared_order_status",
        [...SHARED_ORDER_STATUSES],
    );

export const sharedOrderSourceEnum =
    pgEnum(
        "shared_order_source",
        [...SHARED_ORDER_SOURCES],
    );

export const sharedOrderDeliveryStatusEnum =
    pgEnum(
        "shared_order_delivery_status",
        [...SHARED_ORDER_DELIVERY_STATUSES],
    );

export const sharedOrderPaymentStatusEnum =
    pgEnum(
        "shared_order_payment_status",
        [...SHARED_ORDER_PAYMENT_STATUSES],
    );

/**
 * ============================================================================
 * Shared Orders
 * ============================================================================
 */

export const sharedOrdersTable =
    pgTable(
        "shared_orders",
        {
            /**
             * ----------------------------------------------------------------------
             * Identity
             * ----------------------------------------------------------------------
             */

            id: uuid("id")
                .defaultRandom()
                .primaryKey(),

            /**
             * ----------------------------------------------------------------------
             * Relations
             * ----------------------------------------------------------------------
             */

            messageId: uuid("message_id")
                .notNull()
                .references(
                    () => messagesTable.id,
                    {
                        onDelete: "cascade",
                    },
                ),

            orderId: uuid("order_id").references(
                () => ordersTable.id,
                {
                    onDelete: "set null",
                },
            ),

            /**
             * ----------------------------------------------------------------------
             * Immutable Snapshot
             * ----------------------------------------------------------------------
             */

            orderNumber: varchar(
                "order_number",
                {
                    length:
                    SHARED_ORDER_NUMBER_MAX_LENGTH,
                },
            ).notNull(),

            buyerName: varchar(
                "buyer_name",
                {
                    length:
                    SHARED_ORDER_BUYER_NAME_MAX_LENGTH,
                },
            ),

            sellerName: varchar(
                "seller_name",
                {
                    length:
                    SHARED_ORDER_SELLER_NAME_MAX_LENGTH,
                },
            ),

            currency: varchar(
                "currency",
                {
                    length:
                    SHARED_ORDER_CURRENCY_MAX_LENGTH,
                },
            )
                .default("INR")
                .notNull(),

            totalAmount: numeric(
                "total_amount",
                {
                    precision: 12,
                    scale: 2,
                },
            ).notNull(),

            /**
             * ----------------------------------------------------------------------
             * Status Snapshot
             * ----------------------------------------------------------------------
             */

            status:
                sharedOrderStatusEnum(
                    "status",
                )
                    .default("ACTIVE")
                    .notNull(),

            source:
                sharedOrderSourceEnum(
                    "source",
                )
                    .default(
                        "ORDER_DETAILS",
                    )
                    .notNull(),

            deliveryStatus:
                sharedOrderDeliveryStatusEnum(
                    "delivery_status",
                ).notNull(),

            paymentStatus:
                sharedOrderPaymentStatusEnum(
                    "payment_status",
                ).notNull(),

            /**
             * ----------------------------------------------------------------------
             * Shipping Snapshot
             * ----------------------------------------------------------------------
             */

            trackingNumber: varchar(
                "tracking_number",
                {
                    length:
                    SHARED_ORDER_TRACKING_NUMBER_MAX_LENGTH,
                },
            ),

            courierName: varchar(
                "courier_name",
                {
                    length:
                    SHARED_ORDER_COURIER_NAME_MAX_LENGTH,
                },
            ),

            /**
             * ----------------------------------------------------------------------
             * Analytics
             * ----------------------------------------------------------------------
             */

            sharedCount: bigint(
                "shared_count",
                {
                    mode: "number",
                },
            )
                .default(1)
                .notNull(),

            openedCount: bigint(
                "opened_count",
                {
                    mode: "number",
                },
            )
                .default(0)
                .notNull(),

            /**
             * ----------------------------------------------------------------------
             * Metadata
             * ----------------------------------------------------------------------
             */

            metadata: jsonb(
                "metadata",
            )
                .$type<SharedOrderMetadata>()
                .default(
                    sql`'{}'::jsonb`,
                )
                .notNull(),

            /**
             * ----------------------------------------------------------------------
             * Timeline
             * ----------------------------------------------------------------------
             */

            sharedAt: timestamp(
                "shared_at",
                {
                    withTimezone: true,
                },
            )
                .defaultNow()
                .notNull(),

            createdAt: timestamp(
                "created_at",
                {
                    withTimezone: true,
                },
            )
                .defaultNow()
                .notNull(),

            updatedAt: timestamp(
                "updated_at",
                {
                    withTimezone: true,
                },
            )
                .defaultNow()
                .notNull(),
        },

        (table) => ({
            /**
             * ============================================================
             * Uniqueness
             * ============================================================
             */

            messageUniqueIdx:
                uniqueIndex(
                    "shared_orders_message_uidx",
                ).on(table.messageId),

            /**
             * ============================================================
             * Lookup Indexes
             * ============================================================
             */

            orderIdx: index(
                "shared_orders_order_idx",
            ).on(table.orderId),

            messageIdx: index(
                "shared_orders_message_idx",
            ).on(table.messageId),

            statusIdx: index(
                "shared_orders_status_idx",
            ).on(table.status),

            deliveryStatusIdx: index(
                "shared_orders_delivery_status_idx",
            ).on(
                table.deliveryStatus,
            ),

            paymentStatusIdx: index(
                "shared_orders_payment_status_idx",
            ).on(
                table.paymentStatus,
            ),

            sourceIdx: index(
                "shared_orders_source_idx",
            ).on(table.source),

            sharedAtIdx: index(
                "shared_orders_shared_at_idx",
            ).on(table.sharedAt),

            /**
             * ============================================================
             * Constraints
             * ============================================================
             */

            totalAmountCheck: check(
                "shared_orders_total_amount_chk",
                sql`${table.totalAmount} >= 0`,
            ),

            sharedCountCheck: check(
                "shared_orders_shared_count_chk",
                sql`${table.sharedCount} >= 1`,
            ),

            openedCountCheck: check(
                "shared_orders_opened_count_chk",
                sql`${table.openedCount} >= 0`,
            ),
        }),
    );