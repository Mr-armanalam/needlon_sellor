"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadStripe, StripeEmbeddedCheckout } from "@stripe/stripe-js";
import { Lock, ShieldCheck, AlertCircle, ExternalLink, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StripeEmbeddedCheckoutWidgetProps {
  cart: any[];
  userId: string;
  addressId?: string;
  couponId?: string;
  discountAmount?: number;
  userEmail?: string;
  shippingCharge?: number;
}

export function StripeEmbeddedCheckoutWidget({
  cart,
  userId,
  addressId,
  couponId,
  discountAmount = 0,
  userEmail,
  shippingCharge = 0,
}: StripeEmbeddedCheckoutWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const checkoutInstanceRef = useRef<StripeEmbeddedCheckout | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hostedUrl, setHostedUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<"embedded" | "hosted" | "sandbox">("embedded");
  const [sandboxOrderId, setSandboxOrderId] = useState<string | null>(null);
  const [sandboxRedirectUrl, setSandboxRedirectUrl] = useState<string | null>(null);

  const initStripeCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Clean up previous instance if any
      if (checkoutInstanceRef.current) {
        try {
          checkoutInstanceRef.current.destroy();
        } catch {
          // ignore
        }
        checkoutInstanceRef.current = null;
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embedded: true,
          cartItems: cart,
          userId,
          currentAddressId: addressId,
          couponId,
          discountAmount,
          userEmail,
          shippingCharge,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize checkout session");
      }

      if (data.mode === "sandbox") {
        setMode("sandbox");
        setSandboxOrderId(data.orderId || data.sessionId);
        setSandboxRedirectUrl(data.url);
        setLoading(false);
        return;
      }

      if (data.url) {
        setHostedUrl(data.url);
      }

      if (data.clientSecret && publishableKey) {
        setMode("embedded");
        const stripe = await loadStripe(publishableKey);
        if (!stripe) {
          throw new Error("Unable to initialize Stripe payment provider");
        }

        const checkout = await stripe.initEmbeddedCheckout({
          clientSecret: data.clientSecret,
        });

        checkoutInstanceRef.current = checkout;

        if (containerRef.current) {
          checkout.mount(containerRef.current);
        }
        setLoading(false);
      } else if (data.url) {
        setMode("hosted");
        setLoading(false);
      } else {
        throw new Error("Invalid checkout response from server");
      }
    } catch (err: any) {
      console.error("STRIPE_EMBEDDED_CHECKOUT_ERROR:", err);
      setError(err.message || "An unexpected error occurred while loading Stripe Checkout");
      setLoading(false);
    }
  };

  useEffect(() => {
    initStripeCheckout();

    return () => {
      if (checkoutInstanceRef.current) {
        try {
          checkoutInstanceRef.current.destroy();
        } catch {
          // cleanup
        }
        checkoutInstanceRef.current = null;
      }
    };
  }, [userId, addressId, couponId, discountAmount, shippingCharge]);

  return (
    <div className="w-full">
      {/* Header security badge */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5 font-roboto-sans">
              Instant Encrypted Payment
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                Stripe
              </span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              End-to-end 256-bit SSL encrypted & PCI-DSS Level 1 compliant
            </p>
          </div>
        </div>

        {hostedUrl && (
          <a
            href={hostedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white flex items-center gap-1 underline underline-offset-4 transition"
            title="Open Stripe Hosted Checkout in a separate window"
          >
            <span>External view</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="p-6 space-y-4 rounded-xl border border-stone-200/80 dark:border-white/10 bg-white/50 dark:bg-stone-900/40 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/3" />
              <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
            </div>
          </div>
          <div className="h-10 bg-stone-200 dark:bg-stone-800 rounded-md w-full" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-stone-200 dark:bg-stone-800 rounded-md" />
            <div className="h-10 bg-stone-200 dark:bg-stone-800 rounded-md" />
          </div>
          <div className="h-12 bg-stone-900/10 dark:bg-white/10 rounded-md w-full" />
          <p className="text-xs text-center text-stone-400">Connecting securely to Stripe Payment Gateway...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-center space-y-3">
          <div className="mx-auto w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={initStripeCheckout}
              className="flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </Button>
            {hostedUrl && (
              <Button
                size="sm"
                onClick={() => (window.location.href = hostedUrl)}
                className="flex items-center gap-1.5 cursor-pointer text-xs"
              >
                Proceed via Stripe Window
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Sandbox Fallback Mode */}
      {mode === "sandbox" && !loading && (
        <div className="p-6 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                Sandbox Development Environment
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                Stripe live secret key is running in sandbox mode. Click below to complete order auto-fulfillment.
              </p>
            </div>
          </div>
          {sandboxRedirectUrl && (
            <Button
              onClick={() => (window.location.href = sandboxRedirectUrl)}
              className="w-full h-11 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-semibold cursor-pointer hover:bg-stone-800"
            >
              Complete Sandbox Order (Instant Confirmation)
            </Button>
          )}
        </div>
      )}

      {/* Stripe Embedded Mount Container */}
      <div
        ref={containerRef}
        id="stripe-checkout-container"
        className={`w-full min-h-[400px] transition-opacity duration-300 ${
          loading || error ? "hidden" : "block"
        }`}
      />

      {/* Trust Guarantee Footer */}
      <div className="mt-4 pt-3 border-t border-stone-200/80 dark:border-white/10 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Buyer Purchase Protection
        </span>
        <span>Needlon Certified Official Store</span>
      </div>
    </div>
  );
}
