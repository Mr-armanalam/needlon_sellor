// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-returns/table.ts
// Description: Order Returns table
// Phase: 6.6.4.1 - Foundation
// ============================================================================

import {
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { orders } from "../table";

import { orderItems } from "../order-items/table";

import { orderShipments } from "../order-shipments/table";

import { orderPayments } from "../order-payments/table";

import { seller } from "@/db/schema/seller";

import {
  orderReturnApprovalStatusEnum,
  orderReturnConditionEnum,
  orderReturnInspectionResultEnum,
  orderReturnPickupStatusEnum,
  orderReturnReasonEnum,
  orderReturnRefundStatusEnum,
  orderReturnReplacementStatusEnum,
  orderReturnStatusEnum,
  orderReturnTypeEnum,
} from "./constants";

/**
 * ============================================================================
 * Order Returns
 * ============================================================================
 *
 * Represents a customer return request.
 *
 * Supports
 *
 * • Full Returns
 * • Partial Returns
 * • Refunds
 * • Replacements
 * • Exchanges
 * • Warehouse Inspection
 * • Pickup Scheduling
 * • Return Evidence
 * • Multi-item Orders
 *
 * One Order
 *      │
 *      ├────────► Return #1
 *      ├────────► Return #2
 *      └────────► Return #3
 *
 * Each return request may be associated with:
 *
 * • Entire Order
 * • Individual Order Item
 * • Shipment
 * • Payment
 *
 * ============================================================================
 */

export const orderReturns = pgTable(
  "order_returns",
  {
    /**
     * ------------------------------------------------------------------------
     * Primary Identity
     * ------------------------------------------------------------------------
     */

    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    /**
     * ------------------------------------------------------------------------
     * Parent Order
     * ------------------------------------------------------------------------
     */

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    /**
     * ------------------------------------------------------------------------
     * Order Item
     * ------------------------------------------------------------------------
     *
     * Nullable because a return may apply
     * to the entire order.
     */

    orderItemId: uuid("order_item_id")
      .references(() => orderItems.id, {
        onDelete: "set null",
        onUpdate: "cascade",
      }),

    /**
     * ------------------------------------------------------------------------
     * Shipment
     * ------------------------------------------------------------------------
     *
     * Shipment associated with this return.
     */

    shipmentId: uuid("shipment_id")
      .references(() => orderShipments.id, {
        onDelete: "set null",
        onUpdate: "cascade",
      }),

    /**
     * ------------------------------------------------------------------------
     * Payment
     * ------------------------------------------------------------------------
     *
     * Payment associated with this return.
     * Required for refund processing.
     */

    paymentId: uuid("payment_id")
      .references(() => orderPayments.id, {
        onDelete: "set null",
        onUpdate: "cascade",
      }),

    /**
     * ------------------------------------------------------------------------
     * Seller
     * ------------------------------------------------------------------------
     */

    sellerId: uuid("seller_id")
      .notNull()
      .references(() => seller.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),

    // ---------------------------------------------------------------------
    // Remaining columns implemented in:
    //
    // Phase 6.6.4.2
    // Return Information
    //

        /**
     * ------------------------------------------------------------------------
     * Return Information
     * ------------------------------------------------------------------------
     *
     * Business identifiers and current workflow state.
     *
     * One order may contain multiple return requests.
     * Every return has its own unique return number.
     * ------------------------------------------------------------------------
     */

    returnNumber: varchar("return_number", {
      length: 100,
    }).notNull(),

    /**
     * ------------------------------------------------------------------------
     * Return Status
     * ------------------------------------------------------------------------
     */

    returnStatus: orderReturnStatusEnum(
      "return_status",
    )
      .notNull()
      .default("REQUESTED"),

    /**
     * ------------------------------------------------------------------------
     * Return Type
     * ------------------------------------------------------------------------
     */

    returnType: orderReturnTypeEnum(
      "return_type",
    ).notNull(),

    /**
     * ------------------------------------------------------------------------
     * Customer Selected Reason
     * ------------------------------------------------------------------------
     */

    returnReason: orderReturnReasonEnum(
      "return_reason",
    ).notNull(),

    /**
     * ------------------------------------------------------------------------
     * Approval Workflow
     * ------------------------------------------------------------------------
     */

    approvalStatus:
      orderReturnApprovalStatusEnum(
        "approval_status",
      )
        .notNull()
        .default("PENDING"),

    /**
     * ------------------------------------------------------------------------
     * Refund Workflow
     * ------------------------------------------------------------------------
     */

    refundStatus:
      orderReturnRefundStatusEnum(
        "refund_status",
      )
        .notNull()
        .default("NOT_APPLICABLE"),

    /**
     * ------------------------------------------------------------------------
     * Replacement Workflow
     * ------------------------------------------------------------------------
     */

    replacementStatus:
      orderReturnReplacementStatusEnum(
        "replacement_status",
      )
        .notNull()
        .default("NOT_APPLICABLE"),

    // Phase 6.6.4.3
    // Customer Request & Pickup
    //

        /**
     * ------------------------------------------------------------------------
     * Customer Request
     * ------------------------------------------------------------------------
     *
     * Communication throughout the return process.
     * ------------------------------------------------------------------------
     */

    customerRemarks: text(
      "customer_remarks",
    ),

    sellerRemarks: text(
      "seller_remarks",
    ),

    adminRemarks: text(
      "admin_remarks",
    ),

    /**
     * ------------------------------------------------------------------------
     * Pickup Workflow
     * ------------------------------------------------------------------------
     */

    pickupStatus:
      orderReturnPickupStatusEnum(
        "pickup_status",
      )
        .notNull()
        .default("NOT_REQUIRED"),

    /**
     * ------------------------------------------------------------------------
     * Pickup Address
     * ------------------------------------------------------------------------
     *
     * Snapshot of pickup location.
     */

    pickupAddress: text(
      "pickup_address",
    ),

    /**
     * ------------------------------------------------------------------------
     * Logistics
     * ------------------------------------------------------------------------
     */

    pickupTrackingNumber: varchar(
      "pickup_tracking_number",
      {
        length: 150,
      },
    ),

    pickupReferenceNumber: varchar(
      "pickup_reference_number",
      {
        length: 150,
      },
    ),

    courierPartner: varchar(
      "courier_partner",
      {
        length: 120,
      },
    ),

    /**
     * ------------------------------------------------------------------------
     * Pickup Timeline
     * ------------------------------------------------------------------------
     */

    pickupScheduledAt: timestamp(
      "pickup_scheduled_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    pickedUpAt: timestamp(
      "picked_up_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),


    // Phase 6.6.4.4
    // Inspection & Resolution
    //

        /**
     * ------------------------------------------------------------------------
     * Warehouse Inspection
     * ------------------------------------------------------------------------
     *
     * Inspection performed after the returned
     * product reaches the warehouse.
     * ------------------------------------------------------------------------
     */

    inspectionResult:
      orderReturnInspectionResultEnum(
        "inspection_result",
      )
        .notNull()
        .default("PENDING"),

    returnCondition:
      orderReturnConditionEnum(
        "return_condition",
      ),

    inspectionNotes: text(
      "inspection_notes",
    ),

    inspectedBy: uuid(
      "inspected_by",
    ),

    inspectedAt: timestamp(
      "inspected_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    /**
     * ------------------------------------------------------------------------
     * Resolution
     * ------------------------------------------------------------------------
     */

    refundAmount: numeric(
      "refund_amount",
      {
        precision: 18,
        scale: 2,
      },
    ),

    replacementOrderId: uuid(
      "replacement_order_id",
    ).references(() => orders.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),

    replacementShipmentId: uuid(
      "replacement_shipment_id",
    ).references(
      () => orderShipments.id,
      {
        onDelete: "set null",
        onUpdate: "cascade",
      },
    ),

    /**
     * ------------------------------------------------------------------------
     * Evidence
     * ------------------------------------------------------------------------
     *
     * Evidence collected from the customer
     * and warehouse.
     * ------------------------------------------------------------------------
     */

    imageUrls: jsonb(
      "image_urls",
    ).$type<string[]>(),

    videoUrls: jsonb(
      "video_urls",
    ).$type<string[]>(),

    attachmentUrls: jsonb(
      "attachment_urls",
    ).$type<string[]>(),

    // Phase 6.6.4.5
    // Timeline
    // Metadata
    // Audit
    // Production Indexes
    // ---------------------------------------------------------------------

        /**
     * ------------------------------------------------------------------------
     * Return Timeline
     * ------------------------------------------------------------------------
     *
     * Complete lifecycle of a return request.
     * ------------------------------------------------------------------------
     */

    requestedAt: timestamp(
      "requested_at",
      {
        withTimezone: true,
        mode: "date",
      },
    )
      .defaultNow()
      .notNull(),

    approvedAt: timestamp(
      "approved_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    rejectedAt: timestamp(
      "rejected_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    receivedAt: timestamp(
      "received_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    completedAt: timestamp(
      "completed_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    cancelledAt: timestamp(
      "cancelled_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    /**
     * ------------------------------------------------------------------------
     * Internal Metadata
     * ------------------------------------------------------------------------
     */

    internalNotes: text(
      "internal_notes",
    ),

    /**
     * ------------------------------------------------------------------------
     * Audit
     * ------------------------------------------------------------------------
     */

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
        mode: "date",
      },
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
        mode: "date",
      },
    )
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),

    /**
     * ------------------------------------------------------------------------
     * Soft Delete
     * ------------------------------------------------------------------------
     */

    deletedAt: timestamp(
      "deleted_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),
  },

  (table) => ({
    /**
     * ------------------------------------------------------------------------
     * Foundation Indexes
     * ------------------------------------------------------------------------
     */

    orderIdx: index(
      "order_returns_order_idx",
    ).on(table.orderId),

    orderItemIdx: index(
      "order_returns_order_item_idx",
    ).on(table.orderItemId),

    shipmentIdx: index(
      "order_returns_shipment_idx",
    ).on(table.shipmentId),

    paymentIdx: index(
      "order_returns_payment_idx",
    ).on(table.paymentId),

    sellerIdx: index(
      "order_returns_seller_idx",
    ).on(table.sellerId),

    /**
     * ------------------------------------------------------------------------
     * Dashboard Lookup
     * ------------------------------------------------------------------------
     */

    orderSellerIdx: index(
      "order_returns_order_seller_idx",
    ).on(
      table.orderId,
      table.sellerId,
    ),

    /**
     * ------------------------------------------------------------------------
     * Return Lookup
     * ------------------------------------------------------------------------
     */

    orderItemSellerIdx: index(
      "order_returns_item_seller_idx",
    ).on(
      table.orderItemId,
      table.sellerId,
    ),

    shipmentSellerIdx: index(
      "order_returns_shipment_seller_idx",
    ).on(
      table.shipmentId,
      table.sellerId,
    ),

        /**
     * ------------------------------------------------------------------------
     * Return Information
     * ------------------------------------------------------------------------
     */

    returnNumberIdx: index(
      "order_returns_return_number_idx",
    ).on(table.returnNumber),

    returnStatusIdx: index(
      "order_returns_status_idx",
    ).on(table.returnStatus),

    returnTypeIdx: index(
      "order_returns_type_idx",
    ).on(table.returnType),

    returnReasonIdx: index(
      "order_returns_reason_idx",
    ).on(table.returnReason),

    approvalStatusIdx: index(
      "order_returns_approval_status_idx",
    ).on(table.approvalStatus),

    refundStatusIdx: index(
      "order_returns_refund_status_idx",
    ).on(table.refundStatus),

    replacementStatusIdx: index(
      "order_returns_replacement_status_idx",
    ).on(table.replacementStatus),

    /**
     * ------------------------------------------------------------------------
     * Seller Dashboard
     * ------------------------------------------------------------------------
     */

    sellerReturnStatusIdx: index(
      "order_returns_seller_status_idx",
    ).on(
      table.sellerId,
      table.returnStatus,
    ),

    sellerApprovalIdx: index(
      "order_returns_seller_approval_idx",
    ).on(
      table.sellerId,
      table.approvalStatus,
    ),

    /**
     * ------------------------------------------------------------------------
     * Order Detail
     * ------------------------------------------------------------------------
     */

    orderReturnStatusIdx: index(
      "order_returns_order_status_idx",
    ).on(
      table.orderId,
      table.returnStatus,
    ),

    orderReturnNumberIdx: index(
      "order_returns_order_number_idx",
    ).on(
      table.orderId,
      table.returnNumber,
    ),

    /**
     * ------------------------------------------------------------------------
     * Operations Dashboard
     * ------------------------------------------------------------------------
     */

    approvalWorkflowIdx: index(
      "order_returns_approval_workflow_idx",
    ).on(
      table.approvalStatus,
      table.returnStatus,
    ),

    refundWorkflowIdx: index(
      "order_returns_refund_workflow_idx",
    ).on(
      table.refundStatus,
      table.returnStatus,
    ),

    replacementWorkflowIdx: index(
      "order_returns_replacement_workflow_idx",
    ).on(
      table.replacementStatus,
      table.returnStatus,
    ),

        /**
     * ------------------------------------------------------------------------
     * Customer Request
     * ------------------------------------------------------------------------
     */

    pickupStatusIdx: index(
      "order_returns_pickup_status_idx",
    ).on(table.pickupStatus),

    pickupTrackingIdx: index(
      "order_returns_pickup_tracking_idx",
    ).on(
      table.pickupTrackingNumber,
    ),

    pickupReferenceIdx: index(
      "order_returns_pickup_reference_idx",
    ).on(
      table.pickupReferenceNumber,
    ),

    courierPartnerIdx: index(
      "order_returns_courier_partner_idx",
    ).on(table.courierPartner),

    /**
     * ------------------------------------------------------------------------
     * Pickup Timeline
     * ------------------------------------------------------------------------
     */

    pickupScheduledIdx: index(
      "order_returns_pickup_scheduled_idx",
    ).on(
      table.pickupScheduledAt,
    ),

    pickedUpIdx: index(
      "order_returns_picked_up_idx",
    ).on(table.pickedUpAt),

    /**
     * ------------------------------------------------------------------------
     * Seller Pickup Dashboard
     * ------------------------------------------------------------------------
     */

    sellerPickupIdx: index(
      "order_returns_seller_pickup_idx",
    ).on(
      table.sellerId,
      table.pickupStatus,
    ),

    /**
     * ------------------------------------------------------------------------
     * Courier Dashboard
     * ------------------------------------------------------------------------
     */

    courierPickupIdx: index(
      "order_returns_courier_pickup_idx",
    ).on(
      table.courierPartner,
      table.pickupStatus,
    ),

    /**
     * ------------------------------------------------------------------------
     * Pickup Operations
     * ------------------------------------------------------------------------
     */

    pickupWorkflowIdx: index(
      "order_returns_pickup_workflow_idx",
    ).on(
      table.pickupStatus,
      table.pickupScheduledAt,
    ),

    pickupTrackingLookupIdx: index(
      "order_returns_tracking_lookup_idx",
    ).on(
      table.courierPartner,
      table.pickupTrackingNumber,
    ),

        /**
     * ------------------------------------------------------------------------
     * Warehouse Inspection
     * ------------------------------------------------------------------------
     */

    inspectionResultIdx: index(
      "order_returns_inspection_result_idx",
    ).on(
      table.inspectionResult,
    ),

    returnConditionIdx: index(
      "order_returns_condition_idx",
    ).on(
      table.returnCondition,
    ),

    inspectedByIdx: index(
      "order_returns_inspected_by_idx",
    ).on(
      table.inspectedBy,
    ),

    inspectedAtIdx: index(
      "order_returns_inspected_at_idx",
    ).on(
      table.inspectedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Refund Processing
     * ------------------------------------------------------------------------
     */

    refundAmountIdx: index(
      "order_returns_refund_amount_idx",
    ).on(
      table.refundAmount,
    ),

    replacementOrderIdx: index(
      "order_returns_replacement_order_idx",
    ).on(
      table.replacementOrderId,
    ),

    replacementShipmentIdx: index(
      "order_returns_replacement_shipment_idx",
    ).on(
      table.replacementShipmentId,
    ),

    /**
     * ------------------------------------------------------------------------
     * Warehouse Dashboard
     * ------------------------------------------------------------------------
     */

    warehouseInspectionIdx: index(
      "order_returns_warehouse_idx",
    ).on(
      table.inspectionResult,
      table.inspectedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Resolution Dashboard
     * ------------------------------------------------------------------------
     */

    resolutionWorkflowIdx: index(
      "order_returns_resolution_idx",
    ).on(
      table.refundStatus,
      table.replacementStatus,
    ),

    /**
     * ------------------------------------------------------------------------
     * Seller Resolution
     * ------------------------------------------------------------------------
     */

    sellerResolutionIdx: index(
      "order_returns_seller_resolution_idx",
    ).on(
      table.sellerId,
      table.refundStatus,
      table.replacementStatus,
    ),
        /**
     * ------------------------------------------------------------------------
     * Return Timeline
     * ------------------------------------------------------------------------
     *
     * Complete lifecycle of a return request.
     * ------------------------------------------------------------------------
     */

    requestedAt: timestamp(
      "requested_at",
      {
        withTimezone: true,
        mode: "date",
      },
    )
      .defaultNow()
      .notNull(),

    approvedAt: timestamp(
      "approved_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    rejectedAt: timestamp(
      "rejected_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    receivedAt: timestamp(
      "received_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    completedAt: timestamp(
      "completed_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    cancelledAt: timestamp(
      "cancelled_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    /**
     * ------------------------------------------------------------------------
     * Internal Metadata
     * ------------------------------------------------------------------------
     */

    internalNotes: text(
      "internal_notes",
    ),

    /**
     * ------------------------------------------------------------------------
     * Audit
     * ------------------------------------------------------------------------
     */

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
        mode: "date",
      },
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
        mode: "date",
      },
    )
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),

    /**
     * ------------------------------------------------------------------------
     * Soft Delete
     * ------------------------------------------------------------------------
     */

    deletedAt: timestamp(
      "deleted_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

  }),
);