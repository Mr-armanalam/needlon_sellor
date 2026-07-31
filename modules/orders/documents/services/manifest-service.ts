import { db } from "@/db";
import { orders } from "@/db/schema/orders/table";
import { orderItems } from "@/db/schema/orders/order-items/table";
import { orderAddresses } from "@/db/schema/orders/order-address";
import { orderManifests, orderManifestItems } from "@/db/schema/orders/order-manifests";
import { sellerStore } from "@/db/schema/seller/seller-store";
import { sellerAddresses } from "@/db/schema/seller/seller-address";
import { and, eq, inArray, isNull, desc } from "drizzle-orm";
import { ManifestData, ManifestOrderItem } from "../types";

export async function generateManifestNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  let sequence = 1;
  try {
    const latestManifest = await db
      .select({ manifestNumber: orderManifests.manifestNumber })
      .from(orderManifests)
      .orderBy(desc(orderManifests.createdAt))
      .limit(1);

    if (latestManifest.length > 0 && latestManifest[0].manifestNumber) {
      const parts = latestManifest[0].manifestNumber.split("-");
      if (parts.length === 3) {
        const lastSeq = parseInt(parts[2], 10);
        if (!isNaN(lastSeq)) {
          sequence = lastSeq + 1;
        }
      }
    }
  } catch (e) {
    console.error("Error generating manifest sequence number, fallback to timestamp:", e);
    return `MNF-${currentYear}-${Date.now().toString().slice(-6)}`;
  }

  const paddedSeq = sequence.toString().padStart(6, "0");
  return `MNF-${currentYear}-${paddedSeq}`;
}

export async function createBulkManifest(
  sellerId: string,
  orderIds: string[],
  courierName = "Express Courier",
  pickupDate = new Date()
): Promise<{ manifestRecord: any; manifestData: ManifestData }> {
  if (!orderIds || orderIds.length === 0) {
    throw new Error("No orders selected for manifest generation.");
  }

  // Fetch orders
  const fetchedOrders = await db
    .select()
    .from(orders)
    .where(and(inArray(orders.id, orderIds), eq(orders.sellerId, sellerId), isNull(orders.deletedAt)));

  if (fetchedOrders.length === 0) {
    throw new Error("No valid orders found for the given seller.");
  }

  const manifestNum = await generateManifestNumber();
  let totalCodAmount = 0;
  let totalWeightKg = 0;

  // Insert Manifest Header
  const [manifestRecord] = await db
    .insert(orderManifests)
    .values({
      sellerId: sellerId,
      manifestNumber: manifestNum,
      courierName: courierName,
      pickupDate: pickupDate,
      totalOrders: fetchedOrders.length,
      totalWeight: "0.000",
      status: "GENERATED",
    })
    .returning();

  // Insert items and calculate totals
  const manifestOrderItemsList: ManifestOrderItem[] = [];

  for (const ord of fetchedOrders) {
    await db.insert(orderManifestItems).values({
      manifestId: manifestRecord.id,
      orderId: ord.id,
    });

    const isCod = ord.paymentMethod === "COD";
    const grandTotal = parseFloat(ord.grandTotal?.toString() || "0");
    if (isCod) {
      totalCodAmount += grandTotal;
    }

    // Query items count
    const itemsList = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, ord.id));

    const totalQty = itemsList.reduce((acc, i) => acc + (i.quantity || 1), 0);
    const orderWeight = totalQty * 0.45; // 0.45kg average per apparel item
    totalWeightKg += orderWeight;

    // Address
    const addrs = await db
      .select()
      .from(orderAddresses)
      .where(eq(orderAddresses.orderId, ord.id));
    const delAddr = addrs.find((a) => a.addressType === "DELIVERY") || addrs[0];

    manifestOrderItemsList.push({
      orderNumber: ord.orderNumber,
      buyerName: ord.buyerName,
      buyerPhone: ord.buyerPhone,
      cityState: delAddr ? `${delAddr.city}, ${delAddr.state}` : "Local",
      itemsCount: totalQty,
      weightKg: orderWeight,
      isCod: isCod,
      codAmount: isCod ? grandTotal : 0,
      trackingNumber: `AWB-${ord.orderNumber.replace(/[^A-Za-z0-9]/g, "")}`,
    });
  }

  // Update total weight in manifest
  await db
    .update(orderManifests)
    .set({ totalWeight: totalWeightKg.toFixed(3) })
    .where(eq(orderManifests.id, manifestRecord.id));

  // Store & Seller info with safe try/catch fallbacks
  let store: any = null;
  try {
    const storeList = await db
      .select()
      .from(sellerStore)
      .where(eq(sellerStore.sellerId, sellerId))
      .limit(1);
    store = storeList[0];
  } catch (e) {
    console.error("Failed to query sellerStore, using default boutique fallback:", e);
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
    console.error("Failed to query sellerAddresses, using default address fallback:", e);
  }

  const manifestData: ManifestData = {
    manifestNumber: manifestRecord.manifestNumber,
    pickupDate: new Date(pickupDate).toLocaleDateString("en-IN"),
    courierName: courierName,
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
    totalOrders: fetchedOrders.length,
    totalWeightKg: totalWeightKg,
    totalCodAmount: totalCodAmount,
    orders: manifestOrderItemsList,
  };

  return { manifestRecord, manifestData };
}

export async function getManifestDataById(manifestId: string, sellerId: string): Promise<{ manifestRecord: any; manifestData: ManifestData }> {
  const manifestList = await db
    .select()
    .from(orderManifests)
    .where(and(eq(orderManifests.id, manifestId), eq(orderManifests.sellerId, sellerId)))
    .limit(1);

  if (manifestList.length === 0) {
    throw new Error("Manifest not found.");
  }
  const manifestRecord = manifestList[0];

  const itemLinks = await db
    .select()
    .from(orderManifestItems)
    .where(eq(orderManifestItems.manifestId, manifestId));

  const orderIds = itemLinks.map((it) => it.orderId);

  let manifestOrderItemsList: ManifestOrderItem[] = [];
  let totalCodAmount = 0;

  if (orderIds.length > 0) {
    const fetchedOrders = await db
      .select()
      .from(orders)
      .where(inArray(orders.id, orderIds));

    for (const ord of fetchedOrders) {
      const isCod = ord.paymentMethod === "COD";
      const grandTotal = parseFloat(ord.grandTotal?.toString() || "0");
      if (isCod) totalCodAmount += grandTotal;

      const itemsList = await db.select().from(orderItems).where(eq(orderItems.orderId, ord.id));
      const totalQty = itemsList.reduce((acc, i) => acc + (i.quantity || 1), 0);

      const addrs = await db.select().from(orderAddresses).where(eq(orderAddresses.orderId, ord.id));
      const delAddr = addrs.find((a) => a.addressType === "DELIVERY") || addrs[0];

      manifestOrderItemsList.push({
        orderNumber: ord.orderNumber,
        buyerName: ord.buyerName,
        buyerPhone: ord.buyerPhone,
        cityState: delAddr ? `${delAddr.city}, ${delAddr.state}` : "Local",
        itemsCount: totalQty,
        weightKg: totalQty * 0.45,
        isCod: isCod,
        codAmount: isCod ? grandTotal : 0,
        trackingNumber: `AWB-${ord.orderNumber.replace(/[^A-Za-z0-9]/g, "")}`,
      });
    }
  }

  let store: any = null;
  try {
    const storeList = await db.select().from(sellerStore).where(eq(sellerStore.sellerId, sellerId)).limit(1);
    store = storeList[0];
  } catch (e) {
    console.error("Failed to query sellerStore, using default boutique fallback:", e);
  }

  const manifestData: ManifestData = {
    manifestNumber: manifestRecord.manifestNumber,
    pickupDate: new Date(manifestRecord.pickupDate).toLocaleDateString("en-IN"),
    courierName: manifestRecord.courierName,
    seller: {
      storeName: store?.storeName || "Needlon Boutique",
      phone: store?.supportPhone || "+91 9876543210",
      address: {
        recipientName: store?.storeName || "Needlon Boutique",
        addressLine1: "Store Address",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
      },
    },
    totalOrders: manifestRecord.totalOrders,
    totalWeightKg: parseFloat(manifestRecord.totalWeight || "0"),
    totalCodAmount: totalCodAmount,
    orders: manifestOrderItemsList,
  };

  return { manifestRecord, manifestData };
}

export async function getManifestsListForSeller(sellerId: string) {
  return db
    .select()
    .from(orderManifests)
    .where(eq(orderManifests.sellerId, sellerId))
    .orderBy(desc(orderManifests.createdAt));
}
