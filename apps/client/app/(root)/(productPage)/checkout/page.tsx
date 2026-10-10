import { auth } from "@/auth";
import { fetchCartSSR } from "@/modules/cart/server/cart-fetching";
import { AddressService } from "@/modules/account/services/address-service";
import CheckoutView from "@/modules/checkout/view/checkout-view";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Secure Checkout | Needlon Luxury Attire",
  description: "Complete your bespoke order with encrypted Stripe checkout",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ addressId?: string; couponId?: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/auth?callbackUrl=/checkout");
  }

  const { addressId, couponId } = await searchParams;

  const [cart, addresses] = await Promise.all([
    fetchCartSSR(userId),
    AddressService.getUserAddresses(userId),
  ]);

  return (
    <div className="bg-stone-50 dark:bg-black min-h-screen">
      <CheckoutView
        cart={cart}
        userId={userId}
        userEmail={session.user.email || ""}
        userName={session.user.name || ""}
        initialAddressId={addressId}
        initialCouponId={couponId}
        addresses={addresses as any}
      />
    </div>
  );
}
