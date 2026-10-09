'use server';

export async function recalcAndStoreOrderTotal(orderId: string, podCharge = 0, discountAmountRupees = 0, percentDiscount?: number) {
  const itemsTotal = 2499;
  const shippingTotal = 49;
  const subtotal = itemsTotal + shippingTotal + Number(podCharge || 0);

  let discountApplied = 0;
  if (typeof percentDiscount === "number" && !Number.isNaN(percentDiscount) && percentDiscount > 0) {
    discountApplied = Math.round((subtotal * percentDiscount) / 100);
  } else if (discountAmountRupees && discountAmountRupees > 0) {
    discountApplied = Math.round(Number(discountAmountRupees));
  }

  const total = Math.max(0, Math.round(subtotal - discountApplied));
  return { itemsTotal, shippingTotal, subtotal, discountApplied, total };
}