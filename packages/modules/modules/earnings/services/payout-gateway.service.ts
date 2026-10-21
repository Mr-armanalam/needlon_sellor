export interface PayoutGatewayTransferRequest {
  sellerId: string;
  amount: number;
  currency: string;
  payoutNumber: string;
  bankAccount?: {
    accountHolderName: string;
    bankName: string;
    accountNumberLast4: string;
    ifscCode: string;
    upiId?: string | null;
  };
}

/** Shape of the Stripe Transfer object whose fields this module reads /
 *  persists as the gateway raw response. */
export interface StripeTransferRawResponse {
  id: string;
  object: string;
  amount: number;
  currency: string;
  destination?: string;
  destination_last4?: string;
  settled_at?: string;
  network_status?: string;
}

export interface PayoutGatewayTransferResult {
  success: boolean;
  gateway: string;
  gatewayPayoutId: string;
  status: "COMPLETED" | "PROCESSING" | "PENDING" | "FAILED";
  rawResponse: StripeTransferRawResponse;
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

export class PayoutGatewayService {
  /**
   * Process a payout transfer through Stripe.
   *
   * Fail-closed contract: this method NEVER fabricates a successful payout.
   * - No Stripe secret key configured -> FAILED result with a clear reason.
   * - Stripe rejects or the call throws -> FAILED result with Stripe's error.
   * - Only a real, successful Stripe Transfer response yields COMPLETED.
   */
  public static async processPayout(
    request: PayoutGatewayTransferRequest
  ): Promise<PayoutGatewayTransferResult> {
    const stripeApiKey = process.env.STRIPE_SECRET_KEY;
    const isLiveKey = stripeApiKey?.startsWith("sk_live_") ?? false;
    const isTestKey = stripeApiKey?.startsWith("sk_test_") ?? false;

    if (!stripeApiKey || (!isLiveKey && !isTestKey)) {
      return {
        success: false,
        gateway: "STRIPE",
        gatewayPayoutId: "",
        status: "FAILED",
        failureReason:
          "Stripe payout gateway is not configured: STRIPE_SECRET_KEY is missing or is not a secret key (sk_test_/sk_live_). Payout was not attempted.",
        rawResponse: {
          id: "",
          object: "transfer",
          amount: request.amount,
          currency: request.currency,
          network_status: "not_attempted",
        },
      };
    }

    const gatewayLabel = isLiveKey ? "STRIPE_LIVE" : "STRIPE_TEST";

    try {
      const response = await fetch("https://api.stripe.com/v1/transfers", {
        method: "POST",
        // Bound the call: a hung gateway connection must surface as a
        // FAILED payout, not a payout request stuck in PROCESSING forever.
        signal: AbortSignal.timeout(15000),
        headers: {
          Authorization: `Bearer ${stripeApiKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          amount: Math.round(request.amount * 100).toString(), // convert to paise / smallest unit
          currency: request.currency.toLowerCase(),
          destination: "default_test_account", // Stripe test destination
          description: `Needlon Payout ${request.payoutNumber}`,
        }),
      });

      const body: unknown = await response.json().catch(() => null);

      if (response.ok && isRecord(body) && typeof body.id === "string") {
        const rawResponse: StripeTransferRawResponse = {
          id: body.id,
          object: typeof body.object === "string" ? body.object : "transfer",
          amount:
            typeof body.amount === "number"
              ? body.amount
              : Math.round(request.amount * 100),
          currency:
            typeof body.currency === "string"
              ? body.currency
              : request.currency.toLowerCase(),
          ...(typeof body.destination === "string"
            ? { destination: body.destination }
            : {}),
        };
        return {
          success: true,
          gateway: gatewayLabel,
          gatewayPayoutId: body.id,
          status: "COMPLETED",
          rawResponse,
        };
      }

      const failureReason =
        stripeErrorMessage(body) ??
        `Stripe transfer request failed with HTTP status ${response.status}.`;
      return {
        success: false,
        gateway: gatewayLabel,
        gatewayPayoutId: "",
        status: "FAILED",
        failureReason,
        rawResponse: {
          id: "",
          object: "transfer",
          amount: request.amount,
          currency: request.currency,
          network_status: "failed",
        },
      };
    } catch (err: unknown) {
      return {
        success: false,
        gateway: gatewayLabel,
        gatewayPayoutId: "",
        status: "FAILED",
        failureReason:
          err instanceof Error
            ? `Stripe transfer request failed: ${err.message}`
            : "Stripe transfer request failed with an unknown error.",
        rawResponse: {
          id: "",
          object: "transfer",
          amount: request.amount,
          currency: request.currency,
          network_status: "failed",
        },
      };
    }
  }
}
