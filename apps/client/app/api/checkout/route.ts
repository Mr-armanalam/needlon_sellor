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
      userEmail,
      discountAmount = 0,
      couponId,
      price,
      shippingCharge: explicitShippingCharge,
      embedded = false,
    } = body;

    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    // Compute subtotal and shipping policy (Free if subtotal >= 1999, else ₹49)
    const cartSubtotal = Array.isArray(cartItems)
      ? cartItems.reduce((acc: number, item: any) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)
      : 0;

    const computedShippingCharge =
      typeof explicitShippingCharge === "number"
        ? explicitShippingCharge
        : cartSubtotal >= 1999 || cartSubtotal === 0
        ? 0
        : 49;

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

      const lineItems = mapCartToLineItems(cartItems, 0, false);

      // Create native shipping option
      const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: Math.round(computedShippingCharge * 100),
              currency: "inr",
            },
            display_name: computedShippingCharge === 0 ? "Complimentary Express Delivery" : "Standard Express Delivery",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 4 },
            },
          },
        },
      ];

      // Create one-off Stripe coupon if discount is applied
      let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined = undefined;
      const numDiscount = Number(discountAmount) || 0;
      if (numDiscount > 0) {
        try {
          const stripeCoupon = await stripe.coupons.create({
            amount_off: Math.round(numDiscount * 100),
            currency: "inr",
            duration: "once",
            name: verifiedCouponCode ? `Needlon Promo: ${verifiedCouponCode}` : "Promotional Discount",
          });
          discounts = [{ coupon: stripeCoupon.id }];
        } catch (couponErr: any) {
          console.warn("Stripe coupon creation warning:", couponErr.message);
        }
      }

      const sessionPayload: Stripe.Checkout.SessionCreateParams = {
        line_items: lineItems,
        mode: "payment",
        shipping_options: shippingOptions,
        discounts: discounts,
        allow_promotion_codes: discounts ? undefined : true,
        phone_number_collection: { enabled: true },
        billing_address_collection: "auto",
        ...(userEmail && userEmail.includes("@") ? { customer_email: userEmail } : {}),
        metadata: {
          userId: String(userId),
          addressId: String(currentAddressId || ""),
          couponCode: verifiedCouponCode || "",
          couponDiscount: String(numDiscount),
          shippingCharge: String(computedShippingCharge),
          brand: "Needlon",
          cartSummary: JSON.stringify(
            cartItems.slice(0, 10).map((ci: any) => ({
              p: ci.productId || ci.id,
              q: Number(ci.quantity) || 1,
              s: ci.size || "M",
              c: ci.color || "",
              pr: Number(ci.price) || 2499,
              n: String(ci.name || "").slice(0, 25),
            }))
          ),
        },
      };

      if (embedded) {
        sessionPayload.ui_mode = "embedded";
        sessionPayload.return_url = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;

        const session = await stripe.checkout.sessions.create(sessionPayload);

        return NextResponse.json({
          clientSecret: session.client_secret,
          sessionId: session.id,
          mode: "embedded",
          url: session.url,
        });
      } else {
        sessionPayload.ui_mode = "hosted";
        sessionPayload.success_url = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
        sessionPayload.cancel_url = `${baseUrl}/checkout`;

        const session = await stripe.checkout.sessions.create(sessionPayload);

        return NextResponse.json({
          url: session.url,
          sessionId: session.id,
          mode: "hosted",
        });
      }
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
      mode: "sandbox",
    });
  } catch (error: any) {
    console.error("CHECKOUT_ERROR:", error);
    return NextResponse.json({ error: error.message || "Checkout failed" }, { status: 500 });
  }
}
