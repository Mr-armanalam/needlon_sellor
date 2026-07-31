import { db } from "@/db";
import { orders } from "@/db/schema/orders/table";
import { orderItems } from "@/db/schema/orders/order-items/table";
import { orderAddresses } from "@/db/schema/orders/order-address";
import { orderInvoices } from "@/db/schema/orders/order-invoices";
import { sellerStore } from "@/db/schema/seller/seller-store";
import { sellerAddresses } from "@/db/schema/seller/seller-address";
import { and, eq, isNull, desc } from "drizzle-orm";
import { InvoiceData, OrderDocumentItem } from "../types";
import { generateInvoiceHTML } from "../templates/invoice-generator";

/**
 * Formats sequence counter into INV-2026-XXXXXX number
 */
export async function generateInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  let sequence = 1;
  try {
    const latestInvoice = await db
      .select({ invoiceNumber: orderInvoices.invoiceNumber })
      .from(orderInvoices)
      .orderBy(desc(orderInvoices.createdAt))
      .limit(1);

    if (latestInvoice.length > 0 && latestInvoice[0].invoiceNumber) {
      const parts = latestInvoice[0].invoiceNumber.split("-");
      if (parts.length === 3) {
        const lastSeq = parseInt(parts[2], 10);
        if (!isNaN(lastSeq)) {
          sequence = lastSeq + 1;
        }
      }
    }
  } catch (e) {
    console.error("Error generating invoice sequence number, fallback to timestamp:", e);
    return `INV-${currentYear}-${Date.now().toString().slice(-6)}`;
  }

  const paddedSeq = sequence.toString().padStart(6, "0");
  return `INV-${currentYear}-${paddedSeq}`;
}

/**
 * Assembles InvoiceData structure from DB tables for an order
 */
export async function getInvoiceDataForOrder(orderId: string, sellerId: string): Promise<{ invoiceRecord: any; invoiceData: InvoiceData }> {
  // 1. Query Order
  const orderList = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.sellerId, sellerId), isNull(orders.deletedAt)))
    .limit(1);

  if (orderList.length === 0) {
    throw new Error("Order not found or unauthorized access.");
  }
  const order = orderList[0];

  // 2. Query or create invoice DB record
  let invoiceRecord: any = null;
  const existingInvoices = await db
    .select()
    .from(orderInvoices)
    .where(and(eq(orderInvoices.orderId, orderId), eq(orderInvoices.status, "ISSUED")))
    .orderBy(desc(orderInvoices.createdAt))
    .limit(1);

  if (existingInvoices.length > 0) {
    invoiceRecord = existingInvoices[0];
  } else {
    const invNumber = await generateInvoiceNumber();
    const subtotal = parseFloat(order.subtotal?.toString() || "0");
    const grandTotal = parseFloat(order.grandTotal?.toString() || "0");
    const shippingCharge = parseFloat(order.shippingCharge?.toString() || "0");
    const discountTotal = parseFloat(order.discountAmount?.toString() || "0");
    const taxTotal = parseFloat(order.taxAmount?.toString() || "0") || subtotal * 0.18;

    const [inserted] = await db
      .insert(orderInvoices)
      .values({
        orderId: order.id,
        sellerId: sellerId,
        invoiceNumber: invNumber,
        status: "ISSUED",
        subtotal: subtotal.toString(),
        taxTotal: taxTotal.toString(),
        discountTotal: discountTotal.toString(),
        shippingCharge: shippingCharge.toString(),
        grandTotal: grandTotal.toString(),
      })
      .returning();
    invoiceRecord = inserted;
  }

  // 3. Query items & addresses
  const itemsList = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  const addresses = await db
    .select()
    .from(orderAddresses)
    .where(eq(orderAddresses.orderId, orderId));

  const deliveryAddress = addresses.find((a) => a.addressType === "DELIVERY") || addresses[0];

  // Store details with safe try/catch fallbacks
  let store: any = null;
  try {
    const storeList = await db
      .select()
      .from(sellerStore)
      .where(eq(sellerStore.sellerId, sellerId))
      .limit(1);
    store = storeList[0];
  } catch (e) {
    console.error("Failed to query sellerStore in invoice-service, using default fallback:", e);
  }

  let sellerAddr: any = null;
  try {
    const sellerAddrList = await db
      .select()
      .from(sellerAddresses)
      .where(eq(sellerAddresses.sellerId, sellerId))
      .limit(1);
    sellerAddr = sellerAddrList[0];
  } catch (e) {
    console.error("Failed to query sellerAddresses in invoice-service, using default fallback:", e);
  }

  const mappedItems: OrderDocumentItem[] = itemsList.map((it) => {
    const price = parseFloat(it.unitPrice?.toString() || "0");
    const qty = it.quantity || 1;
    const itemTotal = parseFloat(it.total?.toString() || (price * qty).toString());

    return {
      id: it.id,
      productName: it.productName || "Boutique Apparel",
      variantName: it.variantName || undefined,
      sku: it.sku || `SKU-${it.id.substring(0, 6).toUpperCase()}`,
      hsnCode: "6204",
      quantity: qty,
      unitPrice: price,
      taxRate: 0.18,
      total: itemTotal,
    };
  });

  const invoiceData: InvoiceData = {
    invoiceNumber: invoiceRecord.invoiceNumber,
    invoiceDate: new Date(invoiceRecord.issuedAt || Date.now()).toLocaleDateString("en-IN"),
    orderNumber: order.orderNumber,
    orderDate: new Date(order.createdAt).toLocaleDateString("en-IN"),
    paymentMethod: order.paymentMethod || "COD",
    paymentStatus: order.paymentStatus || "PAID",
    seller: {
      storeName: store?.storeName || "Needlon Boutique",
      legalName: store?.storeName || "Needlon Partner Store",
      gstin: "27AAAAA0000A1Z5",
      email: store?.supportEmail || "seller@needlon.com",
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
      name: order.buyerName || "Customer",
      email: order.buyerEmail || "customer@example.com",
      phone: order.buyerPhone || "+91 9876543210",
      shippingAddress: {
        recipientName: deliveryAddress?.recipientName || order.buyerName,
        addressLine1: deliveryAddress?.addressLine1 || "Delivery Street",
        addressLine2: deliveryAddress?.addressLine2 || undefined,
        city: deliveryAddress?.city || "Pune",
        state: deliveryAddress?.state || "Maharashtra",
        postalCode: deliveryAddress?.postalCode || "411014",
      },
    },
    items: mappedItems,
    subtotal: parseFloat(invoiceRecord.subtotal),
    taxTotal: parseFloat(invoiceRecord.taxTotal),
    discountTotal: parseFloat(invoiceRecord.discountTotal),
    shippingCharge: parseFloat(invoiceRecord.shippingCharge),
    grandTotal: parseFloat(invoiceRecord.grandTotal),
  };

  return { invoiceRecord, invoiceData };
}

/**
 * Regenerates an invoice by creating a new invoice record and cancelling old one
 */
export async function regenerateInvoiceForOrder(orderId: string, sellerId: string) {
  // Cancel active invoices
  await db
    .update(orderInvoices)
    .set({ status: "CANCELLED", cancelledAt: new Date() })
    .where(and(eq(orderInvoices.orderId, orderId), eq(orderInvoices.status, "ISSUED")));

  // Generate new
  return getInvoiceDataForOrder(orderId, sellerId);
}
