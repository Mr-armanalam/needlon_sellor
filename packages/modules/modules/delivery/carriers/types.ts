import { AppError } from "@/modules/shared/errors/app-error";
import type { CarrierCredentials } from "../lib/credentials-crypto";

/**
 * Carrier adapter layer.
 *
 * Every API-integrated shipping partner (aggregators like Shiprocket,
 * direct carrier APIs later) is accessed through the CarrierAdapter
 * interface below. The booking service only ever talks to this interface,
 * so provider specifics (auth style, payload shapes, status vocabularies)
 * stay inside one adapter file per provider.
 *
 * Adapters never read the database and never see plaintext credentials
 * other than the decrypted payload handed to authenticate() by the booking
 * service (decrypted from seller_carrier_connections at call time).
 */

export type CarrierErrorCode =
  | "AUTH_FAILED"
  | "NETWORK"
  | "PROVIDER_REJECTED"
  | "NOT_CONFIGURED";

const CARRIER_ERROR_STATUS: Record<CarrierErrorCode, number> = {
  // The seller has not connected this carrier (or connected it without the
  // credential fields the adapter needs) — fixable by the seller.
  NOT_CONFIGURED: 400,
  // Everything below is an upstream/provider-side failure from the
  // platform's point of view.
  AUTH_FAILED: 502,
  NETWORK: 502,
  PROVIDER_REJECTED: 502,
};

export class CarrierError extends AppError {
  public readonly carrierCode: CarrierErrorCode;

  constructor(code: CarrierErrorCode, message: string) {
    super(message, CARRIER_ERROR_STATUS[code], code);
    this.name = "CarrierError";
    this.carrierCode = code;
  }
}

/** Injectable HTTP implementation — tests point adapters at a stub server. */
export type CarrierFetch = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

export interface CarrierAuthResult {
  token: string;
  /** When the token stops being accepted, if the provider reports one. */
  expiresAt?: Date;
}

export interface CarrierAddress {
  name: string;
  phone: string;
  email?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CarrierBookingItem {
  name: string;
  sku: string;
  quantity: number;
  /** Per-unit selling price in the order currency (INR). */
  unitPrice: number;
}

export interface CarrierParcelDimensions {
  lengthCm: number;
  breadthCm: number;
  heightCm: number;
}

export interface CreateBookingInput {
  order: {
    /** Our platform order number — used as the provider-side order id. */
    orderNumber: string;
    orderDate: Date;
    isCod: boolean;
    subTotal: number;
    shippingCharge: number;
    discount: number;
  };
  items: CarrierBookingItem[];
  pickupAddress: CarrierAddress;
  deliveryAddress: CarrierAddress;
  /** Amount to collect on delivery; 0 for prepaid orders. */
  codAmount: number;
  weightKg?: number;
  dimensionsCm?: CarrierParcelDimensions;
}

export interface CreateBookingResult {
  /** Provider-side order id, when the provider returns one. */
  providerOrderId: string | null;
  /** Provider-side shipment id — required later for label generation. */
  providerShipmentId: string;
  /** Carrier-issued AWB; null when the provider has not assigned a courier yet. */
  awb: string | null;
  courierName: string | null;
  /** Label artifact URL when the booking response already carries one. */
  labelUrl: string | null;
}

export interface CarrierTrackingEvent {
  /** Raw provider status text (e.g. Shiprocket's sr-status-label). */
  status: string;
  description: string;
  occurredAt: Date;
  location?: string;
}

export interface CarrierTrackResult {
  events: CarrierTrackingEvent[];
  /** Raw provider status text for the shipment as a whole. */
  currentStatus: string;
}

export interface CarrierAdapter {
  /** shipping_partners.partnerCode this adapter implements. */
  readonly partnerCode: string;

  /**
   * Exchange the connection's credentials for an access token. Adapters
   * keep the credentials (and the resulting token) on the instance, so
   * callers must authenticate() before any other operation.
   */
  authenticate(credentials: CarrierCredentials): Promise<CarrierAuthResult>;

  createBooking(input: CreateBookingInput): Promise<CreateBookingResult>;

  generateLabel(providerShipmentId: string): Promise<{ labelUrl: string }>;

  track(awb: string): Promise<CarrierTrackResult>;

  cancelShipment(awb: string): Promise<void>;
}
