import { NextResponse } from "next/server";
import { OrderCreationService } from "@/modules/orders/services/order-creation-service";
import { mapCartToLineItems } from "@/modules/checkout/services/map-cart-to-line-items";
import { db } from "@needlon/db";
import { inventoryTable } from "@needlon/db/db/schema/catalog/products/inventory/table";
import { productVariantsTable } from "@needlon/db/db/schema/catalog/products/product-variants/table";
import { promotions } from "@needlon/db/db/schema/marketing/promotion";
import { eq, and } from "drizzle-orm";
import Stripe from "stripe";
import { randomUUID } from "node:crypto";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuid(id: string): boolean {
  return typeof id === "string" && UUID_REGEX.test(id);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      cartItems = [],
      currentAddressId,
      userId = "mock-user",
      discountAmount = 0,
      couponId,
      price,
    } = body;

    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    // 1. Stock Validation against inventoryTable
    if (process.env.DATABASE_URL && Array.isArray(cartItems)) {
      for (const item of cartItems) {
        const pId = item.productId || item.id;
        if (pId && isValidUuid(pId)) {
          const variants = await db
            .select({
              variant: productVariantsTable,
              inventory: inventoryTable,
            })
            .from(productVariantsTable)
            .leftJoin(inventoryTable, eq(productVariantsTable.id, inventoryTable.variantId))
            .where(eq(productVariantsTable.productId, pId));

          if (variants.length > 0) {
            const totalStock = variants.reduce(
              (sum, v) => sum + Math.max(0, (v.inventory?.quantity ?? 0) - (v.inventory?.reservedQuantity ?? 0)),
              0
            );
            if (totalStock <= 0 && !variants.some((v) => v.inventory?.allowBackorder)) {
              return NextResponse.json(
                {
                  error: `Product "${item.name || pId}" is currently out of stock`,
                  outOfStock: true,
                },
                { status: 400 }
              );
            }
          }
        }
      }
    }

    // 2. Validate Coupon if provided
    let verifiedCouponCode: string | undefined = undefined;
    if (process.env.DATABASE_URL && couponId) {
      const [promo] = await db
        .select()
        .from(promotions)
        .where(
          and(
            eq(promotions.status, "ACTIVE"),
            isValidUuid(couponId)
              ? eq(promotions.id, couponId)
              : eq(promotions.couponCode, String(couponId).toUpperCase())
          )
        )
        .limit(1);

      if (promo) {
        verifiedCouponCode = promo.couponCode || undefined;
      }
    }

    // 3. Process Checkout (Live Stripe vs Sandbox Fulfillment)
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && !stripeKey.includes("placeholder") && stripeKey.startsWith("sk_")) {
      const stripe = new Stripe(stripeKey, {
        apiVersion: "2024-12-18.acacia" as any,
      });

      const lineItems = mapCartToLineItems(cartItems, 0);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/cart`,
        metadata: {
          userId: String(userId),
          addressId: String(currentAddressId || ""),
          couponCode: verifiedCouponCode || "",
          couponDiscount: String(discountAmount || 0),
        },
      });

      return NextResponse.json({
        url: session.url,
        sessionId: session.id,
      });
    }

    // Sandbox / Development Auto-Fulfillment
    const mockSessionId = `cs_test_${Date.now()}_${randomUUID().slice(0, 8)}`;
    const orderResult = await OrderCreationService.createOrderFromCheckoutSession({
      sessionId: mockSessionId,
      buyerId: userId,
      buyerAddressId: currentAddressId,
      cartItems: cartItems.map((ci: any) => ({
        productId: ci.productId || ci.id,
        quantity: Number(ci.quantity) || 1,
        size: ci.size,
        color: ci.color,
        price: Number(ci.price) || 2499,
        name: ci.name,
        image: ci.image,
      })),
      couponCode: verifiedCouponCode,
      couponDiscount: Number(discountAmount) || 0,
      paymentMethod: "CARD",
      paymentGateway: "STRIPE",
      currency: "INR",
    });

    return NextResponse.json({
      url: `${baseUrl}/success?session_id=${mockSessionId}`,
      sessionId: mockSessionId,
      orderId: orderResult.orderNumber || orderResult.orderId,
      total: price || orderResult.grandTotal,
    });
  } catch (error: any) {
    console.error("CHECKOUT_ERROR:", error);
    return NextResponse.json({ error: error.message || "Checkout failed" }, { status: 500 });
  }
}
