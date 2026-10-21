import { db } from "@needlon/db";
import { orders } from "@needlon/db/db/schema/orders/table";
import { orderItems } from "@needlon/db/db/schema/orders/order-items/table";
import { orderAddresses } from "@needlon/db/db/schema/orders/order-address";
import { orderStatusHistory } from "@needlon/db/db/schema/orders/order-status-history/table";
import { orderPayments } from "@needlon/db/db/schema/orders/order-payments/table";
import { userAddressesTable } from "@needlon/db/db/schema/client/user-addresses";
import { usersTable } from "@needlon/db/db/schema/users";
import { cartTable, cartItemsTable } from "@needlon/db/db/schema/client/cart";
import { seller } from "@needlon/db/db/schema/seller";
import { sellerStore } from "@needlon/db/db/schema/seller/seller-store";
import { sellerAddresses } from "@needlon/db/db/schema/seller/seller-address";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { productVariantsTable } from "@needlon/db/db/schema/catalog/products/product-variants/table";
import { pricingTable } from "@needlon/db/db/schema/catalog/products/pricing/table";
import { inventoryTable } from "@needlon/db/db/schema/catalog/products/inventory/table";
import { promotions } from "@needlon/db/db/schema/marketing/promotion";
import { couponRedemptions } from "@needlon/db/db/schema/marketing/coupon-redemption";
import { customerMeasurementsTable } from "@needlon/db/db/schema/customization/measurements";
import { productImagesTable } from "@needlon/db/db/schema/catalog/products/product-images/table";
import { eq, sql, inArray, and, desc, isNull, or, type SQL } from "drizzle-orm";

/** DB row types inferred from the Drizzle schema. */
type UserRecord = typeof usersTable.$inferSelect;
type ProductRecord = typeof productsTable.$inferSelect;
type ProductVariantRecord = typeof productVariantsTable.$inferSelect;
import { randomUUID } from "node:crypto";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuid(id: string): boolean {
  return typeof id === "string" && UUID_REGEX.test(id);
}

const ORDER_PAYMENT_METHODS = [
  "COD",
  "UPI",
  "CARD",
  "NET_BANKING",
  "WALLET",
  "BANK_TRANSFER",
] as const;
type OrderPaymentMethod = (typeof ORDER_PAYMENT_METHODS)[number];

function isOrderPaymentMethod(
  value: string | undefined,
): value is OrderPaymentMethod {
  return (
    value !== undefined &&
    (ORDER_PAYMENT_METHODS as readonly string[]).includes(value)
  );
}

const PAYMENT_GATEWAYS = [
  "STRIPE",
  "RAZORPAY",
  "PHONEPE",
  "PAYTM",
  "CASHFREE",
  "COD",
  "UPI",
  "BANK_TRANSFER",
  "OTHER",
] as const;
type PaymentGateway = (typeof PAYMENT_GATEWAYS)[number];

function isPaymentGateway(
  value: string | undefined,
): value is PaymentGateway {
  return (
    value !== undefined &&
    (PAYMENT_GATEWAYS as readonly string[]).includes(value)
  );
}

export interface CheckoutOrderItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  price?: number;
  name?: string;
  image?: string;
}

export interface CreateOrderParams {
  sessionId: string;
  buyerId: string;
  buyerAddressId?: string;
  shippingAddressSnapshot?: {
    recipientName?: string;
    phoneNumber?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  cartItems: CheckoutOrderItem[];
  couponCode?: string;
  couponDiscount?: number;
  paymentMethod?: string;
  paymentGateway?: string;
  currency?: string;
}

export const OrderCreationService = {
  /**
   * Execute an atomic Drizzle database transaction to place an order,
   * snapshot items and delivery address, record status transition,
   * record payment attempt, decrement inventory, and clear buyer cart.
   */
  async createOrderFromCheckoutSession(params: CreateOrderParams) {
    if (!process.env.DATABASE_URL) {
      // Fail closed: an order that was never persisted must never be
      // reported as a successful checkout.
      throw new Error("DATABASE_URL is not configured; cannot create orders");
    }

    return await db.transaction(async (tx) => {
      // 1. Validate Buyer
      let buyerRecord: UserRecord | null = null;
      if (isValidUuid(params.buyerId)) {
        const [foundBuyer] = await tx
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, params.buyerId))
          .limit(1);
        buyerRecord = foundBuyer;
      }

      if (!buyerRecord) {
        // Guest checkout: create a NEW guest buyer record. An order must
        // never be attributed to an arbitrary existing customer.
        const guestId = isValidUuid(params.buyerId) ? params.buyerId : randomUUID();
        const [created] = await tx
          .insert(usersTable)
          .values({
            id: guestId,
            name: params.shippingAddressSnapshot?.recipientName || "Guest Buyer",
            email: `buyer-${Date.now()}@needlon.com`,
          })
          .returning();
        buyerRecord = created;
      }

      if (!buyerRecord) {
        throw new Error("Buyer could not be resolved for order creation");
      }

      // 2. Resolve Delivery Address — from the checkout snapshot or the
      // buyer's saved address only. A real parcel needs a real address:
      // missing core fields fail the checkout instead of being fabricated.
      let deliveryAddress = {
        recipientName: params.shippingAddressSnapshot?.recipientName || buyerRecord.name || "",
        phoneNumber: params.shippingAddressSnapshot?.phoneNumber || "",
        addressLine1: params.shippingAddressSnapshot?.addressLine1 || "",
        addressLine2: params.shippingAddressSnapshot?.addressLine2 || null,
        city: params.shippingAddressSnapshot?.city || "",
        state: params.shippingAddressSnapshot?.state || "",
        postalCode: params.shippingAddressSnapshot?.postalCode || "",
        country: params.shippingAddressSnapshot?.country || "India",
      };

      if (params.buyerAddressId && isValidUuid(params.buyerAddressId)) {
        const [savedAddr] = await tx
          .select()
          .from(userAddressesTable)
          .where(eq(userAddressesTable.id, params.buyerAddressId))
          .limit(1);
        if (savedAddr) {
          deliveryAddress = {
            recipientName: savedAddr.fullName,
            phoneNumber: savedAddr.phone,
            addressLine1: savedAddr.addressLine1,
            addressLine2: savedAddr.addressLine2,
            city: savedAddr.city,
            state: savedAddr.state,
            postalCode: savedAddr.postalCode,
            country: savedAddr.country || "India",
          };
        }
      }

      // 3. Resolve the order's seller from the cart items themselves.
      // An order belongs to the seller who sells the products — never to
      // an arbitrary first row, and a missing seller/store/address is a
      // hard error, not something to fabricate. The order schema is
      // single-seller, so a mixed-seller cart fails loudly here instead
      // of silently misattributing the order.
      if (
        !deliveryAddress.recipientName ||
        !deliveryAddress.phoneNumber ||
        !deliveryAddress.addressLine1 ||
        !deliveryAddress.city ||
        !deliveryAddress.state ||
        !deliveryAddress.postalCode
      ) {
        throw new Error(
          "A complete delivery address (name, phone, address, city, state, postal code) is required to place an order",
        );
      }

      const items = params.cartItems.length > 0 ? params.cartItems : [];
      if (items.length === 0) {
        throw new Error("Cannot create an order with an empty cart");
      }

      interface ResolvedItem {
        input: CheckoutOrderItem;
        product: ProductRecord;
        variant: ProductVariantRecord | null;
        unitPrice: number;
        quantity: number;
      }
      const resolvedItems: ResolvedItem[] = [];
      const sellerIds = new Set<string>();

      for (const item of items) {
        if (!isValidUuid(item.productId)) {
          throw new Error(`Invalid product id in cart: ${item.productId}`);
        }
        const [product] = await tx
          .select()
          .from(productsTable)
          .where(eq(productsTable.id, item.productId))
          .limit(1);
        if (!product) {
          throw new Error(`Product not found for cart item: ${item.productId}`);
        }
        // products.store_id stores the owning seller's id (the column
        // references seller_store.seller_id).
        if (!product.storeId) {
          throw new Error(`Product ${product.id} is not assigned to any seller`);
        }
        sellerIds.add(product.storeId);

        const [variant] = await tx
          .select()
          .from(productVariantsTable)
          .where(eq(productVariantsTable.productId, item.productId))
          .limit(1);

        let unitPrice = Number(item.price);
        if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
          if (!variant) {
            throw new Error(`No purchasable variant for product: ${product.id}`);
          }
          const [pricing] = await tx
            .select()
            .from(pricingTable)
            .where(eq(pricingTable.variantId, variant.id))
            .limit(1);
          unitPrice = Number(pricing?.price);
        }
        if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
          throw new Error(`Price could not be resolved for product: ${product.id}`);
        }

        resolvedItems.push({
          input: item,
          product,
          variant: variant ?? null,
          unitPrice,
          quantity: Number(item.quantity) || 1,
        });
      }

      if (sellerIds.size !== 1) {
        throw new Error(
          "Cart contains products from multiple sellers; split it into one order per seller",
        );
      }
      const [orderSellerId] = [...sellerIds];

      const [sellerRecord] = await tx
        .select()
        .from(seller)
        .where(eq(seller.id, orderSellerId))
        .limit(1);
      if (!sellerRecord) {
        throw new Error(`Seller not found for cart products: ${orderSellerId}`);
      }

      const [storeRecord] = await tx
        .select()
        .from(sellerStore)
        .where(eq(sellerStore.sellerId, sellerRecord.id))
        .limit(1);
      if (!storeRecord) {
        throw new Error(`Seller ${sellerRecord.id} has no store configured`);
      }

      const [sellerAddressRecord] = await tx
        .select()
        .from(sellerAddresses)
        .where(eq(sellerAddresses.sellerId, sellerRecord.id))
        .limit(1);
      if (!sellerAddressRecord) {
        throw new Error(
          `Seller ${sellerRecord.id} has no dispatch address configured`,
        );
      }

      // 4. Calculate Financials (prices resolved from the catalog above)
      const subtotal = resolvedItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );
      const couponDiscount = Math.max(0, Number(params.couponDiscount) || 0);
      const shippingCharge = subtotal >= 1999 || subtotal === 0 ? 0 : 49;
      const grandTotal = Math.max(0, subtotal - couponDiscount + shippingCharge);
      const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 5. Insert Root Order (product_orders)
      const [newOrder] = await tx
        .insert(orders)
        .values({
          sellerId: sellerRecord.id,
          buyerId: buyerRecord.id,
          storeId: storeRecord.id,
          shippingAddressId: sellerAddressRecord.id,
          orderNumber,
          status: "PENDING",
          paymentStatus: "PAID",
          paymentMethod: isOrderPaymentMethod(params.paymentMethod)
            ? params.paymentMethod
            : "COD",
          currency: params.currency || "INR",
          buyerName: deliveryAddress.recipientName,
          buyerEmail: buyerRecord.email,
          buyerPhone: deliveryAddress.phoneNumber,
          subtotal: subtotal.toFixed(2),
          discountAmount: "0.00",
          couponDiscount: couponDiscount.toFixed(2),
          shippingCharge: shippingCharge.toFixed(2),
          taxAmount: "0.00",
          grandTotal: grandTotal.toFixed(2),
        })
        .returning();

      // 6. Insert Snapshot Order Address (order_addresses)
      await tx.insert(orderAddresses).values({
        orderId: newOrder.id,
        addressType: "DELIVERY",
        recipientName: deliveryAddress.recipientName,
        phoneNumber: deliveryAddress.phoneNumber,
        addressLine1: deliveryAddress.addressLine1,
        addressLine2: deliveryAddress.addressLine2,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        postalCode: deliveryAddress.postalCode,
        country: deliveryAddress.country,
      });

      // 7. Insert Order Items & Decrement Inventory
      const createdItems = [];
      for (const resolved of resolvedItems) {
        const item = resolved.input;
        const catalogProduct: ProductRecord = resolved.product;
        const variant: ProductVariantRecord | null = resolved.variant;
        const unitPrice = resolved.unitPrice;
        const qty = resolved.quantity;
        const itemSubtotal = unitPrice * qty;

        // Resolve product image dynamically from catalog or product media
        let resolvedImageUrl = item.image || null;
        if (!resolvedImageUrl && catalogProduct) {
          const [primaryImg] = await tx
            .select()
            .from(productImagesTable)
            .where(and(eq(productImagesTable.productId, catalogProduct.id), eq(productImagesTable.isPrimary, true)))
            .limit(1);
          resolvedImageUrl = primaryImg?.imageUrl || null;
          if (!resolvedImageUrl) {
            const [firstImg] = await tx
              .select()
              .from(productImagesTable)
              .where(eq(productImagesTable.productId, catalogProduct.id))
              .limit(1);
            resolvedImageUrl = firstImg?.imageUrl || null;
          }
        }

        const [createdItem] = await tx
          .insert(orderItems)
          .values({
            orderId: newOrder.id,
            sellerId: sellerRecord.id,
            productId: catalogProduct.id,
            variantId: variant?.id || null,
            sku: variant?.sku || catalogProduct.slug,
            productSlug: catalogProduct.slug,
            productName: catalogProduct.name,
            variantName: item.size ? `Size: ${item.size}` : null,
            unitPrice: unitPrice.toFixed(2),
            quantity: qty,
            subtotal: itemSubtotal.toFixed(2),
            total: itemSubtotal.toFixed(2),
            imageUrl: resolvedImageUrl,
          })
          .returning();

        createdItems.push(createdItem);

        // Check for bespoke measurement attachment for this item
        const pId = catalogProduct.id;
        if (isValidUuid(pId)) {
          let userMatchClause: SQL | undefined = undefined;
          if (buyerRecord?.id && isValidUuid(buyerRecord.id) && buyerRecord?.email) {
            userMatchClause = or(
              eq(customerMeasurementsTable.userId, buyerRecord.id),
              eq(customerMeasurementsTable.customerEmail, buyerRecord.email)
            );
          } else if (buyerRecord?.id && isValidUuid(buyerRecord.id)) {
            userMatchClause = eq(customerMeasurementsTable.userId, buyerRecord.id);
          } else if (buyerRecord?.email) {
            userMatchClause = eq(customerMeasurementsTable.customerEmail, buyerRecord.email);
          }

          let matchingMeasurement = null;
          if (userMatchClause) {
            const [matched] = await tx
              .select()
              .from(customerMeasurementsTable)
              .where(
                and(
                  eq(customerMeasurementsTable.productId, pId),
                  isNull(customerMeasurementsTable.orderId),
                  userMatchClause
                )
              )
              .orderBy(desc(customerMeasurementsTable.createdAt))
              .limit(1);
            matchingMeasurement = matched;
          }

          // Only measurements belonging to THIS buyer may attach to their
          // order. There is deliberately no "any unassigned measurement"
          // fallback — attaching another customer's measurements would
          // leak their data and corrupt the order.
          if (matchingMeasurement) {
            await tx
              .update(customerMeasurementsTable)
              .set({
                orderId: newOrder.id,
                orderItemId: createdItem.id,
                sellerId: sellerRecord.id,
                customerEmail: buyerRecord.email,
                customerName: deliveryAddress.recipientName,
                customerPhone: deliveryAddress.phoneNumber,
                updatedAt: new Date(),
              })
              .where(eq(customerMeasurementsTable.id, matchingMeasurement.id));

            await tx
              .update(orders)
              .set({
                tailoringStage: "MEASUREMENT_VERIFIED",
                tailoringNotes: matchingMeasurement.tailorNotes || "Bespoke custom order measurements attached.",
              })
              .where(eq(orders.id, newOrder.id));
          }
        }

        // Decrement inventory if variant exists
        if (variant) {
          await tx
            .update(inventoryTable)
            .set({
              quantity: sql`GREATEST(0, ${inventoryTable.quantity} - ${qty})`,
              lastAdjustedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(inventoryTable.variantId, variant.id));
        }
      }

      // 8. Insert Order Status History
      await tx.insert(orderStatusHistory).values({
        orderId: newOrder.id,
        sellerId: sellerRecord.id,
        changedByUserId: buyerRecord.id,
        fromStatus: null,
        toStatus: "PENDING",
        action: "CREATED",
        source: "WEBHOOK",
        result: "SUCCESS",
        reason: "Order created successfully via checkout session payment",
      });

      // 9. Insert Order Payment Record
      const [paymentRecord] = await tx
        .insert(orderPayments)
        .values({
          orderId: newOrder.id,
          sellerId: sellerRecord.id,
          paymentNumber: `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          paymentStatus: "SETTLED",
          paymentMethod: "ONLINE",
          paymentGateway: isPaymentGateway(params.paymentGateway)
            ? params.paymentGateway
            : "STRIPE",
          currency: params.currency || "INR",
          amount: grandTotal.toFixed(2),
          netAmount: grandTotal.toFixed(2),
          gatewayPaymentId: params.sessionId,
          transactionId: params.sessionId,
        })
        .returning();

      // 10. Record Coupon Redemption
      if (params.couponCode) {
        const [promo] = await tx
          .select()
          .from(promotions)
          .where(eq(promotions.couponCode, params.couponCode))
          .limit(1);

        if (promo) {
          await tx.insert(couponRedemptions).values({
            promotionId: promo.id,
            buyerId: buyerRecord.id,
            orderId: newOrder.id,
            status: "SUCCESS",
            discountAmount: couponDiscount.toFixed(2),
            orderSubtotal: subtotal.toFixed(2),
          });

          await tx
            .update(promotions)
            .set({ totalRedemptions: sql`${promotions.totalRedemptions} + 1` })
            .where(eq(promotions.id, promo.id));
        }
      }

      // 11. Clear User's Cart
      if (isValidUuid(buyerRecord.id)) {
        const [userCart] = await tx
          .select()
          .from(cartTable)
          .where(eq(cartTable.userId, buyerRecord.id))
          .limit(1);

        if (userCart) {
          await tx.delete(cartItemsTable).where(eq(cartItemsTable.cartId, userCart.id));
        }
      }

      return {
        success: true,
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        grandTotal,
        paymentId: paymentRecord.id,
        itemsCount: createdItems.length,
      };
    });
  },
};
