import { NextRequest, NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { db } from "@/db";
import { orders } from "@/db/schema/orders/table";
import { orderItems } from "@/db/schema/orders/order-items/table";
import { orderAddresses } from "@/db/schema/orders/order-address";
import { sellerStore } from "@/db/schema/seller/seller-store";
import { sellerAddresses } from "@/db/schema/seller/seller-address";
import { and, eq, isNull } from "drizzle-orm";
import { PackingSlipData, OrderDocumentItem } from "@/modules/orders/documents/types";
import { generatePackingSlipHTML } from "@/modules/orders/documents/templates/packing-slip-generator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const seller = await getCurrentSeller();
    if (!seller || !seller.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { id: orderId } = await params;

    const orderList = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.sellerId, seller.id), isNull(orders.deletedAt)))
      .limit(1);

    if (orderList.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Order not found" } },
        { status: 404 }
      );
    }

    const order = orderList[0];
    const itemsList = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
    const addresses = await db.select().from(orderAddresses).where(eq(orderAddresses.orderId, orderId));
    const deliveryAddress = addresses.find((a) => a.addressType === "DELIVERY") || addresses[0];

    let store: any = null;
    try {
      const storeList = await db.select().from(sellerStore).where(eq(sellerStore.sellerId, seller.id)).limit(1);
      store = storeList[0];
    } catch (e) {}

    let sellerAddr: any = null;
    try {
      const sellerAddrList = await db.select().from(sellerAddresses).where(eq(sellerAddresses.sellerId, seller.id)).limit(1);
      sellerAddr = sellerAddrList[0];
    } catch (e) {}

    let totalQty = 0;
    const mappedItems: OrderDocumentItem[] = itemsList.map((it) => {
      const qty = it.quantity || 1;
      totalQty += qty;
      return {
        id: it.id,
        productName: it.productName || "Boutique Apparel",
        variantName: it.variantName || undefined,
        sku: it.sku || `SKU-${it.id.substring(0, 6).toUpperCase()}`,
        quantity: qty,
        unitPrice: parseFloat(it.unitPrice?.toString() || "0"),
        total: parseFloat(it.total?.toString() || "0"),
        weightKg: 0.35,
      };
    });

    const slipData: PackingSlipData = {
      orderNumber: order.orderNumber,
      orderDate: new Date(order.createdAt).toLocaleDateString("en-IN"),
      shippingMethod: order.shippingMethod || "STANDARD",
      seller: {
        storeName: store?.storeName || "Needlon Boutique",
        phone: store?.supportPhone || "+91 9876543210",
        address: {
          recipientName: store?.storeName || "Needlon Boutique",
          addressLine1: sellerAddr?.addressLine1 || "Store Address",
          city: sellerAddr?.city || "Mumbai",
          state: sellerAddr?.state || "Maharashtra",
          postalCode: sellerAddr?.postalCode || "400001",
        },
      },
      buyer: {
        name: order.buyerName,
        phone: order.buyerPhone,
        shippingAddress: {
          recipientName: deliveryAddress?.recipientName || order.buyerName,
          addressLine1: deliveryAddress?.addressLine1 || "Delivery Address",
          addressLine2: deliveryAddress?.addressLine2 || undefined,
          city: deliveryAddress?.city || "Pune",
          state: deliveryAddress?.state || "Maharashtra",
          postalCode: deliveryAddress?.postalCode || "411014",
        },
      },
      items: mappedItems,
      totalQuantity: totalQty,
      totalWeightKg: totalQty * 0.35,
      packingNotes: order.sellerRemark || "Package handle with care. Verify size & variant tag before shipping.",
    };

    const html = generatePackingSlipHTML(slipData);

    return NextResponse.json({
      success: true,
      data: {
        packingSlipData: slipData,
        html,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to generate packing slip" } },
      { status: 500 }
    );
  }
}
