import assert from "node:assert";
import { getFilteredOrdersQuerySchema, getOrderByIdParamsSchema, updateOrderStatusBodySchema } from "../modules/orders/validations";
import { OrderMapper } from "../modules/orders/mapper/order.mapper";
import { OrderTransformer } from "../modules/orders/transformers/order.transformer";

function testValidationSchemas() {
  console.log("--> Testing Zod validations for orders...");
  
  const validQuery = {
    status: "NEW",
    search: "NDL-102",
    deliveryMode: "STANDARD",
    valueTier: "LOW",
    dateRange: "WEEK"
  };
  const parsedQuery = getFilteredOrdersQuerySchema.parse(validQuery);
  assert.strictEqual(parsedQuery.status, "NEW");
  
  const validId = { orderId: "123e4567-e89b-12d3-a456-426614174000" };
  const parsedId = getOrderByIdParamsSchema.parse(validId);
  assert.strictEqual(parsedId.orderId, "123e4567-e89b-12d3-a456-426614174000");
  
  assert.throws(() => {
    getOrderByIdParamsSchema.parse({ orderId: "invalid-uuid" });
  });

  const validBody = { action: "ADVANCE", remarks: "Accepting order" };
  const parsedBody = updateOrderStatusBodySchema.parse(validBody);
  assert.strictEqual(parsedBody.action, "ADVANCE");
  assert.strictEqual(parsedBody.remarks, "Accepting order");

  assert.throws(() => {
    updateOrderStatusBodySchema.parse({ action: "INVALID", remarks: "" });
  });
  
  console.log("✓ Zod validation tests passed.");
}

function testOrderMapper() {
  console.log("--> Testing OrderMapper...");
  
  const mockDbOrder = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    sellerId: "223e4567-e89b-12d3-a456-426614174000",
    buyerId: "323e4567-e89b-12d3-a456-426614174000",
    storeId: "423e4567-e89b-12d3-a456-426614174000",
    shippingAddressId: "523e4567-e89b-12d3-a456-426614174000",
    billingAddressId: null,
    orderNumber: "NDL-001",
    status: "PENDING",
    paymentStatus: "PENDING",
    paymentMethod: "COD",
    shippingMethod: "STANDARD",
    priority: "NORMAL",
    source: "WEB",
    currency: "INR",
    buyerName: "John Doe",
    buyerEmail: "john@example.com",
    buyerPhone: "1234567890",
    subtotal: "1200.00",
    discountAmount: "200.00",
    couponDiscount: "0.00",
    shippingCharge: "50.00",
    taxAmount: "180.00",
    grandTotal: "1230.00",
    isGift: false,
    createdAt: new Date("2026-08-03T12:00:00Z"),
    updatedAt: new Date("2026-08-03T12:05:00Z"),
    deletedAt: null,
  };

  const mockDbItems = [
    {
      id: "723e4567-e89b-12d3-a456-426614174000",
      orderId: "123e4567-e89b-12d3-a456-426614174000",
      sellerId: "223e4567-e89b-12d3-a456-426614174000",
      productId: "823e4567-e89b-12d3-a456-426614174000",
      variantId: null,
      sku: "SKU-001",
      variantSku: null,
      productSlug: "test-product",
      productName: "Test Product",
      variantName: null,
      brandName: "Brand",
      categoryName: "Category",
      unitPrice: "600.00",
      quantity: 2,
      total: "1200.00",
      createdAt: new Date("2026-08-03T12:00:00Z"),
      updatedAt: new Date("2026-08-03T12:00:00Z"),
    }
  ];

  const domainOrder = OrderMapper.toOrderDomain(mockDbOrder, mockDbItems);
  
  assert.strictEqual(domainOrder.id, mockDbOrder.id);
  assert.strictEqual(domainOrder.subtotal, 1200);
  assert.strictEqual(domainOrder.grandTotal, 1230);
  assert.ok(domainOrder.items && domainOrder.items.length === 1);
  assert.strictEqual(domainOrder.items[0].sku, "SKU-001");
  assert.strictEqual(domainOrder.items[0].unitPrice, 600);
  
  console.log("✓ OrderMapper tests passed.");
}

function testOrderTransformer() {
  console.log("--> Testing OrderTransformer...");

  const mockDomainOrder = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    sellerId: "223e4567-e89b-12d3-a456-426614174000",
    buyerId: "323e4567-e89b-12d3-a456-426614174000",
    storeId: "423e4567-e89b-12d3-a456-426614174000",
    shippingAddressId: "523e4567-e89b-12d3-a456-426614174000",
    billingAddressId: null,
    orderNumber: "NDL-001",
    status: "PENDING",
    paymentStatus: "PENDING",
    paymentMethod: "COD",
    shippingMethod: "STANDARD",
    priority: "NORMAL",
    source: "WEB",
    currency: "INR",
    buyerName: "John Doe",
    buyerEmail: "john@example.com",
    buyerPhone: "1234567890",
    subtotal: 1200,
    discountAmount: 200,
    couponDiscount: 0,
    shippingCharge: 50,
    taxAmount: 180,
    grandTotal: 1230,
    isGift: false,
    giftMessage: null,
    requiresSignature: false,
    sellerRemark: null,
    internalRemark: null,
    expectedDeliveryDate: null,
    actualDeliveryDate: null,
    acceptedAt: null,
    packedAt: null,
    readyAt: null,
    shippedAt: null,
    deliveredAt: null,
    cancelledAt: null,
    returnedAt: null,
    createdAt: new Date("2026-08-03T12:00:00Z"),
    updatedAt: new Date("2026-08-03T12:05:00Z"),
    deletedAt: null,
    items: [
      {
        id: "723e4567-e89b-12d3-a456-426614174000",
        orderId: "123e4567-e89b-12d3-a456-426614174000",
        sellerId: "223e4567-e89b-12d3-a456-426614174000",
        productId: "823e4567-e89b-12d3-a456-426614174000",
        variantId: null,
        sku: "SKU-001",
        variantSku: null,
        productSlug: "test-product",
        productName: "Test Product",
        variantName: null,
        brandName: "Brand",
        categoryName: "Category",
        thumbnailUrl: null,
        imageUrl: null,
        snapshotSource: "PRODUCT",
        currency: "INR",
        unitPrice: 600,
        compareAtPrice: null,
        discountType: "NONE",
        discountAmount: 0,
        taxType: "NONE",
        taxRate: 0,
        taxAmount: 0,
        quantity: 2,
        subtotal: 1200,
        total: 1200,
        weight: null,
        length: null,
        width: null,
        height: null,
        inventoryLocation: null,
        warehouseName: null,
        fulfillmentType: "STANDARD",
        itemStatus: "PENDING",
        sellerSku: null,
        notes: null,
        createdAt: new Date("2026-08-03T12:00:00Z"),
        updatedAt: new Date("2026-08-03T12:00:00Z"),
        deletedAt: null,
      }
    ],
    addresses: [],
    history: [],
    payments: []
  };

  const responseDto = OrderTransformer.toListItemDto(mockDomainOrder);
  assert.strictEqual(responseDto.subtotal, "1200.00");
  assert.strictEqual(responseDto.grandTotal, "1230.00");
  assert.strictEqual(responseDto.items[0].unitPrice, "600.00");
  assert.strictEqual(responseDto.items[0].total, "1200.00");

  const detailResponseDto = OrderTransformer.toDetailResponse(mockDomainOrder);
  assert.ok(Array.isArray(detailResponseDto.addresses));
  assert.ok(Array.isArray(detailResponseDto.history));
  assert.ok(Array.isArray(detailResponseDto.payments));
  
  console.log("✓ OrderTransformer tests passed.");
}

function runAllTests() {
  console.log("=== REFAC_ORDERS TEST SUITE ===");
  testValidationSchemas();
  testOrderMapper();
  testOrderTransformer();
  console.log("=== ALL REFAC_ORDERS UNIT TESTS PASSED SUCCESSFULLY! ===");
}

runAllTests();
