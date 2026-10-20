import { auth } from "@/auth";
import { fetchCartSSR } from "@/modules/cart/server/cart-fetching";
import { AddressService } from "@/modules/account/services/address-service";
import CheckoutView from "@/modules/checkout/view/checkout-view";
import type { Address } from "@/types/address";
import { redirect } from "next/navigation";

type UserAddressResult = Awaited<ReturnType<typeof AddressService.getUserAddresses>>[number];

// AddressService returns UI-mapped rows (nullable, with optional fields from
// the Partial<> row it maps). Normalize them to the Address shape
// CheckoutView requires, dropping unmappable rows.
function toAddress(addr: NonNullable<UserAddressResult>, userId: string): Address {
  return {
    id: addr.id ?? "",
    userId: addr.userId ?? userId,
    name: addr.name ?? "",
    phone: addr.phone ?? "",
    pincode: addr.pincode ?? "",
    locality: addr.locality,
    address: addr.address ?? "",
    city: addr.city ?? "",
    state: addr.state ?? "",
    landmark: addr.landmark,
    alternate_phone: addr.alternate_phone,
    createdAt: addr.createdAt ?? new Date(),
    updatedAt: addr.updatedAt ?? new Date(),
  };
}

export const metadata = {
  title: "Secure Checkout | Needlon Luxury Attire",
  description: "Complete your bespoke order with encrypted Stripe checkout",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{
    addressId?: string;
    couponId?: string;
    couponCode?: string;
    discount?: string;
  }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/auth?callbackUrl=/checkout");
  }

  const { addressId, couponId, couponCode, discount } = await searchParams;

  const [cart, userAddresses] = await Promise.all([
    fetchCartSSR(userId),
    AddressService.getUserAddresses(userId),
  ]);

  const addresses: Address[] = userAddresses
    .filter((addr): addr is NonNullable<UserAddressResult> => addr !== null)
    .map((addr) => toAddress(addr, userId));

  return (
    <div className="bg-stone-50 dark:bg-black min-h-screen">
      <CheckoutView
        cart={cart}
        userId={userId}
        userEmail={session.user.email || ""}
        userName={session.user.name || ""}
        initialAddressId={addressId}
        initialCouponId={couponId}
        initialCouponCode={couponCode}
        initialDiscount={discount ? Number(discount) : undefined}
        addresses={addresses}
      />
    </div>
  );
}
