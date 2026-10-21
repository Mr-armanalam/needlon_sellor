import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";
import { shippingPartners } from "./shipping-partners";

// A seller's connection to a platform shipping partner. Credentials the
// seller enters in "Connect Carrier" are stored here, AES-256-GCM encrypted
// (see modules/delivery/lib/credentials-crypto), never on the shared
// shipping_partners row and never returned to the client. Activation lives
// on this per-seller row — one seller can no longer toggle a carrier off
// for the whole platform.
export const carrierEnvironmentEnum = pgEnum("carrier_environment", [
  "SANDBOX",
  "LIVE",
]);

export const sellerCarrierConnections = pgTable(
  "seller_carrier_connections",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    sellerId: uuid("seller_id")
      .notNull()
      .references(() => seller.id, { onDelete: "cascade" }),
    partnerId: uuid("partner_id")
      .notNull()
      .references(() => shippingPartners.id, { onDelete: "cascade" }),

    environment: carrierEnvironmentEnum("environment")
      .notNull()
      .default("SANDBOX"),
    // AES-256-GCM ciphertext (iv:tag:data, base64) of the JSON credential
    // payload, e.g. { apiKey, apiSecret } or { email, password }.
    credentialsEncrypted: text("credentials_encrypted"),
    // Non-secret provider config (pickup location ids, account labels...).
    config: jsonb("config"),

    isActive: boolean("is_active").notNull().default(true),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("seller_carrier_connections_seller_partner_unique").on(
      table.sellerId,
      table.partnerId,
    ),
  ],
);
