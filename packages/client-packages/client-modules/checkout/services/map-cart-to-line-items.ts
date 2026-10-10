import Stripe from "stripe";


function isValidAbsoluteUrl(url?: string): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function mapCartToLineItems(
  cartItems: any[],
  podCharge: number = 0,
  includeShippingAsLineItem: boolean = false
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  cartItems.forEach((item) => {
    const images: string[] = [];
    if (isValidAbsoluteUrl(item.image)) {
      images.push(item.image);
    }

    const descriptionParts: string[] = [];
    if (item.size) descriptionParts.push(`Size: ${item.size}`);
    if (item.color) descriptionParts.push(`Color: ${item.color}`);
    const description = descriptionParts.length > 0 ? descriptionParts.join(" • ") : undefined;

    line_items.push({
      price_data: {
        currency: "INR",
        product_data: {
          name: item.name || "Needlon Tailored Product",
          ...(description ? { description } : {}),
          ...(images.length > 0 ? { images } : {}),
        },
        unit_amount: Math.round(Number(item.price || 0) * 100),
      },
      quantity: Math.max(1, Number(item.quantity) || 1),
    });

    if (includeShippingAsLineItem && Number(item.shippingCharge) > 0) {
      line_items.push({
        price_data: {
          currency: "INR",
          product_data: { name: `${item.name} - Shipping` },
          unit_amount: Math.round(Number(item.shippingCharge) * 100),
        },
        quantity: 1,
      });
    }
  });

  if (podCharge > 0) {
    line_items.push({
      price_data: {
        currency: "INR",
        product_data: { name: "POD Customization Charge" },
        unit_amount: Math.round(podCharge * 100),
      },
      quantity: 1,
    });
  }

  return line_items;
}