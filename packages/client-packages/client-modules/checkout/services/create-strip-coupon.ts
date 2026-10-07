import { stripe } from "@/app/api/checkout/route";


export async function createStripeCoupon(percentDiscount?: number, discountAmount?: number) {
  if (typeof percentDiscount === "number" && percentDiscount > 0) {
    const coupon = await stripe.coupons.create({ percent_off: percentDiscount, duration: "once" });
    return coupon.id;
  } 
  if (discountAmount && discountAmount > 0) {
    const coupon = await stripe.coupons.create({
      amount_off: Math.round(discountAmount * 100),
      currency: "INR",
      duration: "once",
    });
    return coupon.id;
  }
  return undefined;
}