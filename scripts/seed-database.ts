import "dotenv/config";
import { db } from "../db";
import { seller as sellerTable } from "../db/schema/seller";
import { sellerStore as storeTable } from "../db/schema/seller/seller-store";
import { sellerBankAccounts } from "../db/schema/seller/seller-bank-account";
import { sellerAddresses } from "../db/schema/seller/seller-address";
import { categoriesTable } from "../db/schema/catalog/categories/table";
import { brands as brandsTable } from "../db/schema/seller/brand";
import { productsTable } from "../db/schema/catalog/products/table";
import { productVariantsTable } from "../db/schema/catalog/products/product-variants/table";
import { inventoryTable } from "../db/schema/catalog/products/inventory/table";
import { usersTable } from "../db/schema/users";
import { orders } from "../db/schema/orders/table";
import { orderItems } from "../db/schema/orders/order-items/table";
import { orderAddresses } from "../db/schema/orders/order-address";
import { orderStatusHistory } from "../db/schema/orders/order-status-history/table";
import { shippingPartners } from "../db/schema/delivery/shipping-partners";
import { shippingMethods } from "../db/schema/delivery/shipping-method";
import { shipmentOrders } from "../db/schema/delivery/shipping-orders";
import { subscriptionPlans } from "../db/schema/subscription/sucbscription-plan";
import { sellerSubscriptions } from "../db/schema/subscription/seller-subscription";
import { notifications } from "../db/schema/notifications/notification-events";
import { reviewsTable as reviews } from "../db/schema/reviews/table";
import { eq, isNull, and } from "drizzle-orm";

async function seedDatabase() {
  console.log("--> Starting Production-Grade Database Seeding...");

  // 1. Seed/Fetch Default Seller
  let [sellerRow] = await db.select().from(sellerTable).limit(1);
  if (!sellerRow) {
    [sellerRow] = await db
      .insert(sellerTable)
      .values({
        name: "Arman Alam",
        email: "arman@needlon.com",
        role: "seller",
        emailVerified: true,
      })
      .returning();
  }
  console.log(`✓ Seller account ready: ${sellerRow.id}`);

  // 2. Seed/Fetch Default Store
  let [storeRow] = await db
    .select()
    .from(storeTable)
    .where(eq(storeTable.sellerId, sellerRow.id))
    .limit(1);

  if (!storeRow) {
    [storeRow] = await db
      .insert(storeTable)
      .values({
        sellerId: sellerRow.id,
        storeName: "Needlon Apparel Boutique",
        storeSlug: "needlon-apparel-boutique",
        description: "Premium handcrafted apparel and luxury street fashion.",
        status: "ACTIVE",
        visibility: "PUBLIC",
      })
      .returning();
  }
  console.log(`✓ Store profile ready: ${storeRow.storeName}`);

  // 3. Seed Seller Address
  let [sellerAddrRow] = await db
    .select()
    .from(sellerAddresses)
    .where(eq(sellerAddresses.sellerId, sellerRow.id))
    .limit(1);

  if (!sellerAddrRow) {
    [sellerAddrRow] = await db
      .insert(sellerAddresses)
      .values({
        sellerId: sellerRow.id,
        label: "Primary Warehouse",
        addressType: "WAREHOUSE",
        contactPerson: "Arman Alam",
        contactPhone: "+919876543210",
        addressLine1: "12/4 Industrial Hub",
        city: "New Delhi",
        state: "Delhi",
        postalCode: "110001",
        countryCode: "IN",
        isDefault: true,
        isVerified: true,
      })
      .returning();
  }
  console.log("✓ Seller primary address ready.");

  // 4. Seed Bank Account
  const existingBank = await db
    .select()
    .from(sellerBankAccounts)
    .where(eq(sellerBankAccounts.sellerId, sellerRow.id))
    .limit(1);

  if (existingBank.length === 0) {
    await db.insert(sellerBankAccounts).values({
      sellerId: sellerRow.id,
      accountHolderName: "Arman Alam",
      bankName: "HDFC Bank",
      accountNumber: "50100987654321",
      accountNumberLast4: "4321",
      ifscCode: "HDFC0001234",
      branchName: "Connaught Place Branch",
      accountType: "BUSINESS",
      isPrimary: true,
      verificationStatus: "VERIFIED",
    });
  }
  console.log("✓ Bank account ready.");

  // 5. Seed Subscription Plans & Active Subscription
  let plans = await db.select().from(subscriptionPlans).limit(3);
  if (plans.length === 0) {
    plans = await db
      .insert(subscriptionPlans)
      .values([
        {
          planCode: "FREE_TIER",
          planName: "Free Starter Plan",
          description: "Essential tools for boutique sellers.",
          price: "0.00",
          billingType: "MONTHLY",
          displayOrder: 1,
        },
        {
          planCode: "STARTER_PRO",
          planName: "Pro Merchant Plan",
          description: "Advanced analytics, lower commission.",
          price: "999.00",
          billingType: "YEARLY",
          isPopular: true,
          displayOrder: 2,
        },
        {
          planCode: "ENTERPRISE_VIP",
          planName: "Enterprise VIP Plan",
          description: "Lowest commission, priority support.",
          price: "2999.00",
          billingType: "YEARLY",
          displayOrder: 3,
        },
      ])
      .returning();
  }

  const existingSub = await db
    .select()
    .from(sellerSubscriptions)
    .where(eq(sellerSubscriptions.sellerId, sellerRow.id))
    .limit(1);

  if (existingSub.length === 0) {
    const proPlan = plans.find((p) => p.planCode === "STARTER_PRO") || plans[0];
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    await db.insert(sellerSubscriptions).values({
      sellerId: sellerRow.id,
      planId: proPlan.id,
      planNameSnapshot: proPlan.planName,
      planPriceSnapshot: proPlan.price,
      billingTypeSnapshot: proPlan.billingType,
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      autoRenew: true,
    });
  }
  console.log("✓ Seller subscriptions ready.");

  // 6. Seed Shipping Partners & Methods
  let partners = await db.select().from(shippingPartners).limit(3);
  if (partners.length === 0) {
    partners = await db
      .insert(shippingPartners)
      .values([
        {
          partnerCode: "FEDEX",
          partnerName: "FedEx Express",
          websiteUrl: "https://www.fedex.com",
          supportsCod: true,
          supportsPickup: true,
          displayOrder: 1,
        },
        {
          partnerCode: "DHL",
          partnerName: "DHL International",
          websiteUrl: "https://www.dhl.com",
          supportsCod: false,
          supportsPickup: true,
          displayOrder: 2,
        },
        {
          partnerCode: "INHOUSE",
          partnerName: "In-House Local Fleet",
          supportsCod: true,
          supportsPickup: true,
          displayOrder: 3,
        },
      ])
      .returning();

    for (const p of partners) {
      await db.insert(shippingMethods).values({
        partnerId: p.id,
        methodCode: `${p.partnerCode}_STD`,
        methodName: `${p.partnerName} Standard`,
        estimatedMinDays: 1,
        estimatedMaxDays: 3,
        supportsCod: p.supportsCod,
      });
    }
  }
  console.log("✓ Shipping partners ready.");

  // 7. Seed Category & Brand
  let [catRow] = await db.select().from(categoriesTable).limit(1);
  if (!catRow) {
    [catRow] = await db
      .insert(categoriesTable)
      .values({
        name: "Apparel & Fashion",
        slug: "apparel-fashion",
        code: "CAT-APP-01",
        path: "apparel-fashion",
        level: 0,
        isLeaf: true,
        description: "Men & Women clothing and streetwear",
      })
      .returning();
  }

  let [brandRow] = await db.select().from(brandsTable).limit(1);
  if (!brandRow) {
    [brandRow] = await db
      .insert(brandsTable)
      .values({
        sellerId: sellerRow.id,
        name: "Needlon Originals",
        slug: "needlon-originals",
        description: "In-house luxury brand",
      })
      .returning();
  }

  // 8. Seed Sample Products & Variants
  const sampleProducts = [
    { name: "Luxury Oversized Heavyweight Hoodie", price: "2499.00", sku: "SKU-HOODIE-01", stock: 80, threshold: 10 },
    { name: "Tailored Slim Denim Jacket", price: "3299.00", sku: "SKU-DENIM-02", stock: 45, threshold: 8 },
    { name: "Vintage Wash Cotton Graphic Tee", price: "999.00", sku: "SKU-TEE-03", stock: 3, threshold: 5 },
    { name: "Urban Cargo Jogger Pants", price: "1899.00", sku: "SKU-CARGO-04", stock: 2, threshold: 5 },
  ];

  for (const item of sampleProducts) {
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const existingProduct = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, slug))
      .limit(1);

    if (existingProduct.length === 0) {
      const [prod] = await db
        .insert(productsTable)
        .values({
          storeId: sellerRow.id,
          categoryId: catRow.id,
          name: item.name,
          slug,
          description: `${item.name} handcrafted for durability and everyday luxury.`,
          status: "PUBLISHED",
          visibility: "PUBLIC",
          productType: "PHYSICAL",
        })
        .returning();

      const [variant] = await db
        .insert(productVariantsTable)
        .values({
          productId: prod.id,
          name: `${item.name} - Default Size`,
          sku: item.sku,
          price: item.price,
          status: "ACTIVE",
        })
        .returning();

      await db.insert(inventoryTable).values({
        variantId: variant.id,
        quantity: item.stock,
        reservedQuantity: 2,
        lowStockThreshold: item.threshold,
        allowBackorder: false,
      });
    }
  }
  console.log("✓ Sample products & inventory ready.");

  // 9. Seed Buyer User
  let [buyerRow] = await db.select().from(usersTable).limit(1);
  if (!buyerRow) {
    [buyerRow] = await db
      .insert(usersTable)
      .values({
        email: "sarah.jenkins@example.com",
        name: "Sarah Jenkins",
        number: "+919811223344",
      })
      .returning();
  }

  // 10. Seed Sample Orders
  const [firstProduct] = await db.select().from(productsTable).limit(1);
  const sampleOrders = [
    { orderNum: "NDL-1001", status: "PENDING", total: "2499.00", buyerName: "Sarah Jenkins", buyerEmail: "sarah@example.com" },
    { orderNum: "NDL-1002", status: "CONFIRMED", total: "3299.00", buyerName: "Alex Rivera", buyerEmail: "alex@example.com" },
    { orderNum: "NDL-1003", status: "PROCESSING", total: "1899.00", buyerName: "Priya Sharma", buyerEmail: "priya@example.com" },
    { orderNum: "NDL-1004", status: "SHIPPED", total: "4998.00", buyerName: "Michael Chen", buyerEmail: "michael@example.com" },
    { orderNum: "NDL-1005", status: "DELIVERED", total: "999.00", buyerName: "Rohan Gupta", buyerEmail: "rohan@example.com" },
  ];

  for (const o of sampleOrders) {
    const existingOrder = await db
      .select()
      .from(orders)
      .where(and(eq(orders.sellerId, sellerRow.id), eq(orders.orderNumber, o.orderNum)))
      .limit(1);

    if (existingOrder.length === 0) {
      const [orderRow] = await db
        .insert(orders)
        .values({
          sellerId: sellerRow.id,
          buyerId: buyerRow.id,
          storeId: storeRow.id,
          shippingAddressId: sellerAddrRow.id,
          orderNumber: o.orderNum,
          status: o.status as any,
          paymentStatus: o.status === "DELIVERED" ? "PAID" : "PENDING",
          paymentMethod: "COD",
          shippingMethod: "STANDARD",
          buyerName: o.buyerName,
          buyerEmail: o.buyerEmail,
          buyerPhone: "+919876543210",
          subtotal: o.total,
          grandTotal: o.total,
        })
        .returning();

      await db
        .insert(orderAddresses)
        .values({
          orderId: orderRow.id,
          addressType: "DELIVERY",
          recipientName: o.buyerName,
          phoneNumber: "+919876543210",
          addressLine1: "Flat 402, Connaught Heights",
          city: "New Delhi",
          state: "Delhi",
          postalCode: "110001",
          country: "India",
        });

      await db.insert(orderItems).values({
        orderId: orderRow.id,
        sellerId: sellerRow.id,
        productId: firstProduct.id,
        productSlug: firstProduct.slug,
        sku: "SKU-PROD-01",
        productName: firstProduct.name,
        unitPrice: o.total,
        quantity: 1,
        subtotal: o.total,
        total: o.total,
      });

      await db.insert(orderStatusHistory).values({
        orderId: orderRow.id,
        sellerId: sellerRow.id,
        fromStatus: "PENDING",
        toStatus: o.status as any,
        action: "UPDATED",
        source: "SYSTEM",
        remarks: `Order created with initial status ${o.status}`,
      });
    }
  }
  console.log("✓ Sample orders & fulfillment history ready.");

  // 11. Seed Notifications
  const existingNotifs = await db
    .select()
    .from(notifications)
    .where(eq(notifications.recipientId, sellerRow.id))
    .limit(1);

  if (existingNotifs.length === 0) {
    await db.insert(notifications).values([
      {
        recipientType: "SELLER",
        recipientId: sellerRow.id,
        notificationType: "NEW_ORDER",
        title: "New Order Received",
        message: "Order #NDL-1001 placed by Sarah Jenkins.",
        priority: "HIGH",
        isRead: false,
      },
      {
        recipientType: "SELLER",
        recipientId: sellerRow.id,
        notificationType: "LOW_STOCK",
        title: "Low Stock Alert",
        message: "Vintage Wash Cotton Graphic Tee stock is down to 3 units.",
        priority: "NORMAL",
        isRead: false,
      },
      {
        recipientType: "SELLER",
        recipientId: sellerRow.id,
        notificationType: "SYSTEM",
        title: "Store Setup Verified",
        message: "Your Needlon Apparel Boutique store is live and ready for orders.",
        priority: "LOW",
        isRead: true,
      },
    ]);
  }
  console.log("✓ In-app notifications ready.");

  console.log("=== SEEDING COMPLETED SUCCESSFULLY! ===");
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
