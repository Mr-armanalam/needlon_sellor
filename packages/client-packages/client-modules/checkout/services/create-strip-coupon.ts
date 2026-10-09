export async function createStripeCoupon(percentDiscount?: number, discountAmount?: number) {
  if (percentDiscount || discountAmount) {
    return "mock-stripe-coupon";
  }
  return undefined;
}