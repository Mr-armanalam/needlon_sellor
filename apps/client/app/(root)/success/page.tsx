/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, Truck, ArrowRight, ShoppingBag } from "lucide-react";
import { getOrderFromDB } from "@/modules/webhook/server/get-orderfrmdb";

export const metadata = {
  title: "Order Confirmation | Needlon",
  description: "Your Needlon luxury order has been confirmed",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  if (!sessionId) redirect("/");

  const { line_items, Payment } = await getOrderFromDB(sessionId ?? "");
  if (!line_items || !Payment) redirect("/");

  const isPaid = Payment.status === "paid";

  return (
    <main className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-white/10 shadow-sm p-6 sm:p-8 text-center">
        {/* Animated Checkmark Badge */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h1 className="font-garamond font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white mb-1">
          {isPaid ? "Thank You for Your Order" : "Payment Awaiting Confirmation"}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto mb-6 font-roboto-sans">
          {isPaid
            ? "Your bespoke Needlon order has been confirmed and transferred to our master tailors for fulfillment."
            : "Your payment transaction is being verified by Stripe."}
        </p>

        {/* Order Details Receipt Box */}
        <div className="bg-stone-50 dark:bg-stone-800/40 rounded-xl p-5 text-left border border-stone-200/60 dark:border-white/5 space-y-4 mb-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-white/10 text-xs">
            <span className="text-stone-500">Order Reference</span>
            <span className="font-mono font-bold text-gray-900 dark:text-white">
              {String(Payment.orderId || sessionId.slice(-8).toUpperCase())}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500">Payment Status</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 uppercase text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {isPaid ? "Paid via Stripe" : "Processing"}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500">Total Paid</span>
            <span className="font-mono font-bold text-base text-gray-900 dark:text-white">
              ₹{Number(Payment.paymentAmount || 0).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="pt-2 border-t border-stone-200/60 dark:border-white/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              Purchased Items
            </p>
            <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
              {line_items.data.map((item: any, idx: number) => (
                <li key={idx} className="flex justify-between items-center py-1">
                  <span className="line-clamp-1">{item.description}</span>
                  <span className="font-mono text-stone-500 ml-2">×{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-stone-200/60 dark:border-white/10 flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
            <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Estimated delivery in 2–4 business days with Express Air</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/m-account/orders"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs sm:text-sm font-semibold hover:bg-stone-800 transition cursor-pointer"
          >
            <Package className="w-4 h-4" />
            Track Order Status
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-stone-300 dark:border-white/20 text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
