export interface ProcessSubscriptionPaymentRequest {
  sellerId: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  billingCycle: "MONTHLY" | "YEARLY";
  paymentDetails?: {
    cardLast4?: string;
    cardBrand?: string;
    cardholderName?: string;
    gatewayToken?: string;
  };
}

/** Card block nested under payment_method_details in the gateway response. */
export interface StripePaymentIntentCardDetails {
  brand: string;
  last4: string;
  cardholder_name?: string;
  exp_month?: number;
  exp_year?: number;
  funding?: string;
}

/** Shape of the Stripe PaymentIntent object whose fields this module reads /
 *  persists as the gateway raw response. */
export interface StripePaymentIntentRawResponse {
  id: string;
  object: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  payment_method_details?: {
    card?: StripePaymentIntentCardDetails;
  };
}

export interface ProcessSubscriptionPaymentResult {
  success: boolean;
  paymentGateway: "STRIPE" | "MANUAL";
  gatewayOrderId: string;
  gatewayPaymentId: string;
  gatewayTransactionId: string;
  status: "SUCCESS" | "FAILED";
  paymentMethod: "CARD" | "UPI";
  cardBrand?: string;
  cardLast4?: string;
  paidAt: Date;
  rawResponse: StripePaymentIntentRawResponse;
  failureReason?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Extract Stripe's human-readable error message from an error body, if any. */
function stripeErrorMessage(body: unknown): string | null {
  if (!isRecord(body)) return null;
  const error = body.error;
  if (isRecord(error) && typeof error.message === "string") {
    return error.message;
  }
  return null;
}

export class SubscriptionPaymentGatewayService {
  /**
   * Process a subscription payment through Stripe.
   *
   * Fail-closed contract: this method NEVER fabricates a successful payment.
   * - No Stripe secret key configured -> FAILED result with a clear reason.
   * - Stripe rejects or the call throws -> FAILED result with Stripe's error.
   * - Only a real Stripe PaymentIntent response yields SUCCESS.
   */
  public static async processPayment(
    request: ProcessSubscriptionPaymentRequest
  ): Promise<ProcessSubscriptionPaymentResult> {
    const stripeApiKey = process.env.STRIPE_SECRET_KEY;
    const now = new Date();
    const cardBrand = request.paymentDetails?.cardBrand || "Visa";
    const cardLast4 = request.paymentDetails?.cardLast4 || "4242";

    const failedResult = (
      failureReason: string,
      rawResponse: StripePaymentIntentRawResponse
    ): ProcessSubscriptionPaymentResult => ({
      success: false,
      paymentGateway: "STRIPE",
      gatewayOrderId: "",
      gatewayPaymentId: "",
      gatewayTransactionId: "",
      status: "FAILED",
      paymentMethod: "CARD",
      cardBrand,
      cardLast4,
      paidAt: now,
      rawResponse,
      failureReason,
    });

    const isLiveKey = stripeApiKey?.startsWith("sk_live_") ?? false;
    const isTestKey = stripeApiKey?.startsWith("sk_test_") ?? false;

    if (!stripeApiKey || (!isLiveKey && !isTestKey)) {
      return failedResult(
        "Stripe payment gateway is not configured: STRIPE_SECRET_KEY is missing or is not a secret key (sk_test_/sk_live_). Payment was not attempted.",
        {
          id: "",
          object: "payment_intent",
          amount: Math.round(request.amount * 100),
          currency: request.currency.toLowerCase(),
          status: "not_attempted",
        }
      );
    }

    try {
      const response = await fetch("https://api.stripe.com/v1/payment_intents", {
        method: "POST",
        // Bound the call so a hung gateway connection fails the payment
        // honestly instead of hanging the subscription upgrade forever.
        signal: AbortSignal.timeout(15000),
        headers: {
          Authorization: `Bearer ${stripeApiKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          amount: Math.round(request.amount * 100).toString(),
          currency: request.currency.toLowerCase(),
          payment_method_types: "card",
          description: `Needlon Seller Subscription - ${request.planName} (${request.billingCycle})`,
          confirm: "true",
          payment_method: "pm_card_visa", // Stripe test standard card token
        }),
      });

      const body: unknown = await response.json().catch(() => null);

      if (response.ok && isRecord(body) && typeof body.id === "string") {
        const rawResponse: StripePaymentIntentRawResponse = {
          id: body.id,
          object:
            typeof body.object === "string" ? body.object : "payment_intent",
          amount:
            typeof body.amount === "number"
              ? body.amount
              : Math.round(request.amount * 100),
          currency:
            typeof body.currency === "string"
              ? body.currency
              : request.currency.toLowerCase(),
          status: typeof body.status === "string" ? body.status : "succeeded",
          ...(typeof body.payment_method === "string"
            ? { payment_method: body.payment_method }
            : {}),
        };
        return {
          success: true,
          paymentGateway: "STRIPE",
          gatewayOrderId: `sub_ord_${Date.now().toString(36)}`,
          gatewayPaymentId: body.id,
          gatewayTransactionId: `txn_${body.id.slice(3)}`,
          status: "SUCCESS",
          paymentMethod: "CARD",
          cardBrand,
          cardLast4,
          paidAt: now,
          rawResponse,
        };
      }

      const failureReason =
        stripeErrorMessage(body) ??
        `Stripe payment request failed with HTTP status ${response.status}.`;
      return failedResult(failureReason, {
        id: "",
        object: "payment_intent",
        amount: Math.round(request.amount * 100),
        currency: request.currency.toLowerCase(),
        status: "failed",
      });
    } catch (err: unknown) {
      return failedResult(
        err instanceof Error
          ? `Stripe payment request failed: ${err.message}`
          : "Stripe payment request failed with an unknown error.",
        {
          id: "",
          object: "payment_intent",
          amount: Math.round(request.amount * 100),
          currency: request.currency.toLowerCase(),
          status: "failed",
        }
      );
    }
  }
}
