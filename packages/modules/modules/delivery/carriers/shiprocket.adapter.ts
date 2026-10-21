import type { CarrierCredentials } from "../lib/credentials-crypto";
import {
  CarrierError,
  type CarrierAdapter,
  type CarrierAuthResult,
  type CarrierFetch,
  type CarrierTrackResult,
  type CarrierTrackingEvent,
  type CreateBookingInput,
  type CreateBookingResult,
} from "./types";

/**
 * Shiprocket adapter (aggregator API, https://apiv2.shiprocket.in/v1/external).
 *
 * ASSUMPTIONS from Shiprocket's published API documentation — live
 * verification against a real Shiprocket account is still outstanding:
 *  - POST /auth/login { email, password } returns { token }; tokens are
 *    valid ~10 days. Login is rate-limited, hence the in-memory cache.
 *  - POST /orders/create/adhoc creates the order and returns order_id +
 *    shipment_id; awb_code / courier_name are only populated when a
 *    courier is auto-assigned by the account's rules — otherwise the AWB
 *    stays null until assignment happens provider-side.
 *  - Adhoc orders reference a pickup location by its registered nickname
 *    ("Primary" is the default primary location on new accounts); the raw
 *    pickup address cannot be sent with the order. The nickname comes from
 *    the connection's config (pickupLocation), falling back to the seller's
 *    delivery-settings hub name, then "Primary".
 *  - POST /courier/generate/label { shipment_id: [id] } returns label_url.
 *  - GET /courier/track/awb/{awb} returns tracking_data with
 *    shipment_track_activities[] carrying date / activity / location and
 *    the status text under "sr-status-label" (fallback: "status").
 *  - POST /orders/cancel/shipment/awb { awbs: [awb] } cancels by AWB.
 */

const DEFAULT_BASE_URL = "https://apiv2.shiprocket.in/v1/external";
const DEFAULT_PICKUP_LOCATION = "Primary";
/** Shiprocket tokens live ~10 days; refresh a day early. */
const TOKEN_TTL_MS = 9 * 24 * 60 * 60 * 1000;

interface CachedToken {
  token: string;
  expiresAt: number;
}

/** Process-wide token cache, one entry per carrier connection. */
const tokenCache = new Map<string, CachedToken>();

export interface ShiprocketAdapterOptions {
  /** shipping_partners.api_base_url for SHIPROCKET; defaults to production. */
  baseUrl?: string | null;
  /** seller_carrier_connections.id — scopes the token cache entry. */
  connectionId?: string | null;
  /** Registered Shiprocket pickup-location nickname (see header note). */
  pickupLocationName?: string | null;
  /** Injectable for tests; defaults to the global fetch. */
  fetchImpl?: CarrierFetch;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringField(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function numberField(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/** Best-effort extraction of the provider's human-readable error message. */
function providerMessage(body: unknown, fallback: string): string {
  if (isRecord(body)) {
    const message = stringField(body, "message");
    if (message) return message;
    const errors = body["errors"];
    if (isRecord(errors)) {
      for (const value of Object.values(errors)) {
        if (typeof value === "string") return value;
        if (Array.isArray(value)) {
          const first = value.find((v): v is string => typeof v === "string");
          if (first) return first;
        }
      }
    }
    if (typeof errors === "string") return errors;
  }
  return fallback;
}

/** Shiprocket expects 10-digit Indian mobile numbers. */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/** Shiprocket order_date format: "YYYY-MM-DD HH:mm". */
function formatOrderDate(date: Date): string {
  const pad = (n: number): string => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

function parseProviderDate(raw: string | null): Date {
  if (raw) {
    // Shiprocket activity dates arrive as "YYYY-MM-DD HH:mm:ss" (IST) or
    // ISO strings; the space form parses as local time, close enough for a
    // tracking timeline and stable for dedupe.
    const parsed = new Date(raw.replace(" ", "T"));
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

export class ShiprocketAdapter implements CarrierAdapter {
  readonly partnerCode = "SHIPROCKET";

  private readonly baseUrl: string;
  private readonly fetchImpl: CarrierFetch;
  private readonly connectionId: string | null;
  private readonly pickupLocationName: string;
  private credentials: CarrierCredentials | null = null;
  private token: string | null = null;

  constructor(options: ShiprocketAdapterOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.fetchImpl = options.fetchImpl ?? ((input, init) => fetch(input, init));
    this.connectionId = options.connectionId ?? null;
    this.pickupLocationName =
      options.pickupLocationName?.trim() || DEFAULT_PICKUP_LOCATION;
  }

  async authenticate(credentials: CarrierCredentials): Promise<CarrierAuthResult> {
    const email = credentials.email?.trim();
    const password = credentials.password;
    if (!email || !password) {
      throw new CarrierError(
        "NOT_CONFIGURED",
        "Shiprocket connections must store the account email and password " +
          "(credential keys \"email\" and \"password\"). Reconnect the carrier with those credentials.",
      );
    }
    this.credentials = credentials;

    const cacheKey = this.cacheKey(email);
    const cached = tokenCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      this.token = cached.token;
      return { token: cached.token, expiresAt: new Date(cached.expiresAt) };
    }

    const body = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }, { authenticated: false, authFailure: true });

    const token = isRecord(body) ? stringField(body, "token") : null;
    if (!token) {
      throw new CarrierError(
        "AUTH_FAILED",
        "Shiprocket login did not return a token. Check the connected account email and password.",
      );
    }

    const expiresAt = Date.now() + TOKEN_TTL_MS;
    tokenCache.set(cacheKey, { token, expiresAt });
    this.token = token;
    return { token, expiresAt: new Date(expiresAt) };
  }

  async createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
    const token = await this.requireToken();
    const delivery = input.deliveryAddress;
    const deliveryAddressText = [delivery.addressLine1, delivery.addressLine2]
      .filter((part): part is string => typeof part === "string" && part.length > 0)
      .join(", ");

    // Billing and shipping are the same customer address for marketplace
    // orders, so shipping_is_billing is true and the shipping_* fields are
    // omitted, per Shiprocket's payload contract.
    const payload: Record<string, unknown> = {
      order_id: input.order.orderNumber,
      order_date: formatOrderDate(input.order.orderDate),
      pickup_location: this.pickupLocationName,
      billing_customer_name: delivery.name,
      billing_address: deliveryAddressText,
      billing_city: delivery.city,
      billing_pincode: delivery.postalCode,
      billing_state: delivery.state,
      billing_country: delivery.country || "India",
      billing_email: delivery.email ?? "",
      billing_phone: normalizePhone(delivery.phone),
      shipping_is_billing: true,
      order_items: input.items.map((item) => ({
        name: item.name,
        sku: item.sku,
        units: item.quantity,
        selling_price: item.unitPrice,
      })),
      payment_method: input.order.isCod ? "COD" : "Prepaid",
      sub_total: input.order.subTotal,
      shipping_charges: input.order.shippingCharge,
      total_discount: input.order.discount,
      length: input.dimensionsCm?.lengthCm ?? 10,
      breadth: input.dimensionsCm?.breadthCm ?? 10,
      height: input.dimensionsCm?.heightCm ?? 10,
      weight: input.weightKg ?? 0.5,
    };
    if (input.order.isCod) {
      payload["cod_amount"] = input.codAmount;
    }

    const body = await this.request("/orders/create/adhoc", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }, { authenticated: true });

    if (!isRecord(body)) {
      throw new CarrierError(
        "PROVIDER_REJECTED",
        "Shiprocket returned an unreadable response while creating the order.",
      );
    }
    const shipmentId = numberField(body, "shipment_id");
    if (shipmentId == null) {
      throw new CarrierError(
        "PROVIDER_REJECTED",
        providerMessage(body, "Shiprocket did not return a shipment id for the booking."),
      );
    }
    const orderId = numberField(body, "order_id");
    return {
      providerOrderId: orderId != null ? String(orderId) : null,
      providerShipmentId: String(shipmentId),
      awb: stringField(body, "awb_code"),
      courierName: stringField(body, "courier_name"),
      labelUrl: stringField(body, "label_url"),
    };
  }

  async generateLabel(providerShipmentId: string): Promise<{ labelUrl: string }> {
    const token = await this.requireToken();
    const numericId = Number(providerShipmentId);
    const shipmentIdValue: number | string = Number.isFinite(numericId)
      ? numericId
      : providerShipmentId;

    const body = await this.request("/courier/generate/label", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ shipment_id: [shipmentIdValue] }),
    }, { authenticated: true });

    const labelUrl = isRecord(body) ? stringField(body, "label_url") : null;
    if (!labelUrl) {
      throw new CarrierError(
        "PROVIDER_REJECTED",
        providerMessage(body, "Shiprocket did not return a label URL for this shipment."),
      );
    }
    return { labelUrl };
  }

  async track(awb: string): Promise<CarrierTrackResult> {
    const token = await this.requireToken();
    const body = await this.request(
      `/courier/track/awb/${encodeURIComponent(awb)}`,
      { method: "GET", headers: { Authorization: `Bearer ${token}` } },
      { authenticated: true },
    );

    const trackingData = isRecord(body) ? body["tracking_data"] : null;
    if (!isRecord(trackingData)) {
      throw new CarrierError(
        "PROVIDER_REJECTED",
        providerMessage(body, `Shiprocket returned no tracking data for AWB ${awb}.`),
      );
    }

    const activities = trackingData["shipment_track_activities"];
    const events: CarrierTrackingEvent[] = [];
    if (Array.isArray(activities)) {
      for (const entry of activities) {
        if (!isRecord(entry)) continue;
        const status =
          stringField(entry, "sr-status-label") ??
          stringField(entry, "status") ??
          "IN_TRANSIT";
        events.push({
          status,
          description:
            stringField(entry, "activity") ?? status,
          occurredAt: parseProviderDate(stringField(entry, "date")),
          location: stringField(entry, "location") ?? undefined,
        });
      }
    }
    events.sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());

    const last = events[events.length - 1];
    return {
      events,
      currentStatus: last ? last.status : "UNKNOWN",
    };
  }

  async cancelShipment(awb: string): Promise<void> {
    const token = await this.requireToken();
    await this.request("/orders/cancel/shipment/awb", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ awbs: [awb] }),
    }, { authenticated: true });
  }

  private cacheKey(email: string): string {
    return this.connectionId ?? `shiprocket:${email.toLowerCase()}`;
  }

  private async requireToken(): Promise<string> {
    if (this.token) {
      // Reuse the cached token when it is still within its TTL.
      const key = this.credentials?.email
        ? this.cacheKey(this.credentials.email)
        : null;
      const cached = key ? tokenCache.get(key) : undefined;
      if (!cached || cached.expiresAt > Date.now()) return this.token;
      this.token = null;
    }
    if (!this.credentials) {
      throw new CarrierError(
        "NOT_CONFIGURED",
        "Shiprocket adapter used before authenticate(): no credentials were supplied.",
      );
    }
    const { token } = await this.authenticate(this.credentials);
    return token;
  }

  private async request(
    path: string,
    init: RequestInit,
    options: { authenticated: boolean; authFailure?: boolean },
  ): Promise<unknown> {
    let response: Response;
    try {
      response = await this.fetchImpl(`${this.baseUrl}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init.headers ?? {}),
        },
      });
    } catch (err) {
      throw new CarrierError(
        "NETWORK",
        `Could not reach Shiprocket (${path}): ${err instanceof Error ? err.message : "network error"}`,
      );
    }

    const text = await response.text();
    let body: unknown = null;
    if (text.length > 0) {
      try {
        body = JSON.parse(text) as unknown;
      } catch {
        body = null;
      }
    }

    if (!response.ok) {
      const message = providerMessage(
        body,
        `Shiprocket request ${path} failed with HTTP ${response.status}.`,
      );
      if (options.authFailure || (options.authenticated && response.status === 401)) {
        throw new CarrierError("AUTH_FAILED", message);
      }
      throw new CarrierError("PROVIDER_REJECTED", message);
    }
    return body;
  }
}
