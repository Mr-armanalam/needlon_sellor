"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Lock,
  Tag,
  MapPin,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/address";
import { ChooseAddress } from "@/modules/cart/components/choose-address";
import { StripeEmbeddedCheckoutWidget } from "../ui/stripe-embedded-checkout";

interface CheckoutViewProps {
  cart: any[];
  userId: string;
  userEmail?: string;
  userName?: string;
  initialAddressId?: string;
  initialCouponId?: string;
  addresses: Address[];
}

export default function CheckoutView({
  cart,
  userId,
  userEmail,
  userName,
  initialAddressId,
  initialCouponId,
  addresses = [],
}: CheckoutViewProps) {
  // 1. Address Resolution
  const [currentAddress, setCurrentAddress] = useState<Address | undefined>(() => {
    if (initialAddressId) {
      const found = addresses.find((a) => a.id === initialAddressId);
      if (found) return found;
    }
    const defaultAddr = addresses.find((a) => (a as any).isDefault);
    return defaultAddr || addresses[0];
  });

  useEffect(() => {
    if (!currentAddress && addresses.length > 0) {
      const savedId = typeof window !== "undefined" ? localStorage.getItem("current-addr") : null;
      const found = savedId ? addresses.find((a) => a.id === savedId) : null;
      setCurrentAddress(found || addresses.find((a) => (a as any).isDefault) || addresses[0]);
    }
  }, [addresses, currentAddress]);

  // 2. Financial Totals
  const subtotal = Math.round(
    cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0)
  );

  const mrpTotal = Math.round(
    cart.reduce(
      (sum, item) => sum + Number(item.mrp_price || item.price || 0) * Number(item.quantity || 1),
      0
    )
  );

  const retailDiscount = Math.max(0, mrpTotal - subtotal);

  // 3. Coupon Handling
  const [couponCode, setCouponCode] = useState(initialCouponId ? "WELCOME20" : "");
  const [couponDiscount, setCouponDiscount] = useState<number>(() => {
    if (initialCouponId) return Math.round(subtotal * 0.1);
    return 0;
  });

  // Shipping Policy: Complimentary if subtotal >= 1999, else 49
  const shippingCharge = subtotal >= 1999 || subtotal === 0 ? 0 : 49;
  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingCharge);

  if (!cart || cart.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-garamond text-3xl font-semibold text-gray-900 dark:text-white mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-md mx-auto text-sm">
          Explore our seasonal collection and add your favorite tailored pieces to proceed with checkout.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-semibold hover:opacity-90 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Stepper Breadcrumb Header */}
      <div className="py-6 border-b border-stone-200 dark:border-white/10 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Bag
            </Link>
            <span className="text-stone-300 dark:text-stone-700">/</span>
            <span className="font-garamond font-bold text-lg text-gray-900 dark:text-white tracking-wide">
              NEEDLON CHECKOUT
            </span>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                ✓
              </span>
              <span>1. Bag</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-700" />
            <div className="flex items-center gap-1.5 text-stone-900 dark:text-white font-semibold">
              <span className="w-5 h-5 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center text-[10px]">
                2
              </span>
              <span>2. Delivery</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-700" />
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-5 h-5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                3
              </span>
              <span>3. Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-16">
        {/* Left Column: Order Items & Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery Address Card */}
          <section className="bg-white dark:bg-stone-900/60 rounded-xl p-5 border border-stone-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-500" />
                <h2 className="font-roboto-sans font-semibold text-sm uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Shipping Destination
                </h2>
              </div>
              {addresses.length > 0 && (
                <ChooseAddress
                  addresses={addresses}
                  currentAddressId={currentAddress?.id}
                  onSelectAddress={(addr: Address) => {
                    setCurrentAddress(addr);
                    if (typeof window !== "undefined") {
                      localStorage.setItem("current-addr", addr.id);
                    }
                  }}
                />
              )}
            </div>

            {currentAddress ? (
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                  <span>{currentAddress.name || userName}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-normal">
                    {currentAddress.pincode}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm">
                  {currentAddress.address}
                  {currentAddress.landmark ? `, Near ${currentAddress.landmark}` : ""}
                  {currentAddress.locality ? `, ${currentAddress.locality}` : ""}
                </p>
                {currentAddress.phone && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 pt-1">
                    Contact: <span className="font-mono">{currentAddress.phone}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="text-sm text-stone-500">
                <p>No delivery address selected.</p>
                <Link
                  href="/account/address"
                  className="text-xs font-semibold underline underline-offset-4 text-stone-900 dark:text-white mt-1 inline-block"
                >
                  Add a delivery address in your account
                </Link>
              </div>
            )}

            {/* Express Delivery ETA */}
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-white/10 flex items-center gap-2.5 text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded-lg">
              <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>Express Air Shipping:</strong> Estimated arrival within{" "}
                <span className="font-semibold text-stone-900 dark:text-white">2–4 Business Days</span>
              </span>
            </div>
          </section>

          {/* Bag Line Items Preview */}
          <section className="bg-white dark:bg-stone-900/60 rounded-xl p-5 border border-stone-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-white/10">
              <h2 className="font-roboto-sans font-semibold text-sm uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Order Items ({cart.length})
              </h2>
              <Link
                href="/cart"
                className="text-xs font-medium text-stone-500 hover:text-black dark:hover:text-white underline underline-offset-4"
              >
                Modify Cart
              </Link>
            </div>

            <div className="divide-y divide-stone-100 dark:divide-white/5 max-h-[360px] overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={item.id || idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-16 bg-stone-100 dark:bg-stone-800 rounded overflow-hidden flex-shrink-0 border border-stone-200/60 dark:border-white/10">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name || "Product"}
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                          Needlon
                        </div>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-1">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>• Color: {item.color}</span>}
                        <span>• Qty: {item.quantity || 1}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white font-mono">
                      ₹{Math.round(Number(item.price) * Number(item.quantity || 1)).toLocaleString("en-IN")}
                    </p>
                    {item.mrp_price && Number(item.mrp_price) > Number(item.price) && (
                      <p className="text-[11px] text-stone-400 line-through font-mono">
                        ₹{Math.round(Number(item.mrp_price) * Number(item.quantity || 1)).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Needlon Brand Trust Assurances */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-white dark:bg-stone-900/40 rounded-lg border border-stone-200/80 dark:border-white/5 text-center">
              <ShieldCheck className="w-5 h-5 mx-auto text-stone-800 dark:text-stone-200 mb-1" />
              <p className="text-[11px] font-semibold text-gray-900 dark:text-white">100% Authentic</p>
              <p className="text-[10px] text-stone-400">Verified Quality</p>
            </div>
            <div className="p-3 bg-white dark:bg-stone-900/40 rounded-lg border border-stone-200/80 dark:border-white/5 text-center">
              <RefreshCcw className="w-5 h-5 mx-auto text-stone-800 dark:text-stone-200 mb-1" />
              <p className="text-[11px] font-semibold text-gray-900 dark:text-white">30-Day Returns</p>
              <p className="text-[10px] text-stone-400">Easy Exchanges</p>
            </div>
            <div className="p-3 bg-white dark:bg-stone-900/40 rounded-lg border border-stone-200/80 dark:border-white/5 text-center">
              <Lock className="w-5 h-5 mx-auto text-stone-800 dark:text-stone-200 mb-1" />
              <p className="text-[11px] font-semibold text-gray-900 dark:text-white">PCI-DSS Secure</p>
              <p className="text-[10px] text-stone-400">Stripe Protected</p>
            </div>
            <div className="p-3 bg-white dark:bg-stone-900/40 rounded-lg border border-stone-200/80 dark:border-white/5 text-center">
              <Truck className="w-5 h-5 mx-auto text-stone-800 dark:text-stone-200 mb-1" />
              <p className="text-[11px] font-semibold text-gray-900 dark:text-white">Tracked Courier</p>
              <p className="text-[10px] text-stone-400">Doorstep Delivery</p>
            </div>
          </section>
        </div>

        {/* Right Column: Price Details & Stripe Payment Gateway */}
        <div className="lg:col-span-5 space-y-6">
          {/* Price Breakdown Card */}
          <section className="bg-white dark:bg-stone-900/60 rounded-xl p-5 border border-stone-200 dark:border-white/10 shadow-sm space-y-4">
            <h2 className="font-garamond font-bold text-lg text-gray-900 dark:text-white pb-3 border-b border-stone-100 dark:border-white/10">
              Payment Summary
            </h2>

            <table className="w-full text-xs sm:text-sm space-y-2">
              <tbody className="divide-y divide-stone-100 dark:divide-white/5">
                <tr>
                  <td className="py-2 text-stone-600 dark:text-stone-400">Total MRP ({cart.length} items)</td>
                  <td className="py-2 text-right font-mono font-medium text-gray-800 dark:text-gray-200">
                    ₹{mrpTotal.toLocaleString("en-IN")}
                  </td>
                </tr>

                {retailDiscount > 0 && (
                  <tr>
                    <td className="py-2 text-stone-600 dark:text-stone-400">Retail Savings</td>
                    <td className="py-2 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      - ₹{retailDiscount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                )}

                {couponDiscount > 0 && (
                  <tr>
                    <td className="py-2 text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Promotion Discount</span>
                    </td>
                    <td className="py-2 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      - ₹{couponDiscount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                )}

                <tr>
                  <td className="py-2 text-stone-600 dark:text-stone-400">Shipping & Handling</td>
                  <td className="py-2 text-right font-mono font-medium">
                    {shippingCharge === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase text-xs">
                        FREE
                      </span>
                    ) : (
                      `₹${shippingCharge}`
                    )}
                  </td>
                </tr>

                <tr className="font-bold text-base text-gray-950 dark:text-white">
                  <td className="pt-3">Grand Total Payable</td>
                  <td className="pt-3 text-right font-mono text-lg">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
            </table>

            {(retailDiscount > 0 || couponDiscount > 0) && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs px-3 py-2 rounded-lg font-medium text-center">
                🎉 Total savings on this order: ₹{(retailDiscount + couponDiscount).toLocaleString("en-IN")}
              </div>
            )}
          </section>

          {/* Stripe Embedded Payment Section */}
          <section className="bg-white dark:bg-stone-900/60 rounded-xl p-5 border border-stone-200 dark:border-white/10 shadow-sm">
            <StripeEmbeddedCheckoutWidget
              cart={cart}
              userId={userId}
              addressId={currentAddress?.id}
              couponId={initialCouponId}
              discountAmount={couponDiscount}
              userEmail={userEmail}
              shippingCharge={shippingCharge}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
