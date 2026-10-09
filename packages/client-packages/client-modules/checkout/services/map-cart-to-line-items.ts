import Stripe from "stripe";


export function mapCartToLineItems(cartItems: any[], podCharge: number) {
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  cartItems.forEach((item) => {
    line_items.push({
      price_data: {
        currency: "INR",
        product_data: { name: item.name, images: item.image ? [item.image] : [] },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    });

    if (item.shippingCharge > 0) {
      line_items.push({
        price_data: {
          currency: "INR",
          product_data: { name: `${item.name} - Shipping` },
          unit_amount: Math.round(item.shippingCharge * 100),
        },
        quantity: 1,
      });
    }
  });

  if (podCharge > 0) {
    line_items.push({
      price_data: {
        currency: "INR",
        product_data: { name: "POD Charge" },
        unit_amount: Math.round(podCharge * 100),
      },
      quantity: 1,
    });
  }
  return line_items;
}