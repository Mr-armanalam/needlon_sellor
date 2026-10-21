import "dotenv/config";
import postgres from "postgres";

/**
 * One-time, idempotent seed of the REAL platform shipping-partner catalogue.
 *
 * This replaces the old runtime behaviour where the delivery repository
 * invented "sandbox" partners on first read. Partners are platform data:
 * they are created here (or later, from the admin surface) — never by
 * request-handling code. Safe to re-run: rows are upserted by partner_code.
 *
 * Usage: DATABASE_URL=... tsx scripts/seed-delivery-partners.ts
 */
async function seedDeliveryPartners() {
  const sql = postgres(process.env.DATABASE_URL!);

  try {
    const partners = [
      {
        code: "SHIPROCKET",
        name: "Shiprocket",
        integrationType: "AGGREGATOR_API",
        apiBaseUrl: "https://apiv2.shiprocket.in/v1/external",
        websiteUrl: "https://www.shiprocket.in",
        trackingUrlTemplate: "https://shiprocket.co/tracking/{awb}",
        supportsCod: true,
        supportsPickup: true,
        supportsReturn: true,
        displayOrder: 1,
      },
      {
        code: "INHOUSE",
        name: "In-House Local Fleet",
        integrationType: "INHOUSE",
        apiBaseUrl: null,
        websiteUrl: null,
        trackingUrlTemplate: null,
        supportsCod: true,
        supportsPickup: true,
        supportsReturn: false,
        displayOrder: 2,
      },
    ] as const;

    for (const p of partners) {
      const [partner] = await sql`
        INSERT INTO shipping_partners (
          partner_code, partner_name, integration_type, api_base_url,
          website_url, tracking_url_template, supports_cod, supports_pickup,
          supports_return, is_active, display_order
        ) VALUES (
          ${p.code}, ${p.name}, ${p.integrationType}, ${p.apiBaseUrl},
          ${p.websiteUrl}, ${p.trackingUrlTemplate}, ${p.supportsCod},
          ${p.supportsPickup}, ${p.supportsReturn}, true, ${p.displayOrder}
        )
        ON CONFLICT (partner_code) DO UPDATE SET
          partner_name = EXCLUDED.partner_name,
          integration_type = EXCLUDED.integration_type,
          api_base_url = EXCLUDED.api_base_url,
          website_url = EXCLUDED.website_url,
          tracking_url_template = EXCLUDED.tracking_url_template,
          supports_cod = EXCLUDED.supports_cod,
          supports_pickup = EXCLUDED.supports_pickup,
          supports_return = EXCLUDED.supports_return,
          display_order = EXCLUDED.display_order,
          updated_at = NOW()
        RETURNING id, partner_code
      `;
      console.log(`partner: ${partner.partner_code} (${partner.id})`);

      // One default method per partner, created only if the partner has none.
      const methods = [
        {
          partnerCode: "SHIPROCKET",
          methodCode: "SHIPROCKET_STD",
          methodName: "Shiprocket Standard",
          minDays: 2,
          maxDays: 5,
        },
        {
          partnerCode: "INHOUSE",
          methodCode: "INHOUSE_LOCAL",
          methodName: "Local Delivery (Same Day)",
          minDays: 0,
          maxDays: 1,
        },
      ] as const;

      for (const m of methods.filter((x) => x.partnerCode === p.code)) {
        await sql`
          INSERT INTO shipping_methods (
            partner_id, method_code, method_name,
            estimated_min_days, estimated_max_days,
            supports_cod, supports_pickup, is_active
          )
          SELECT ${partner.id}, ${m.methodCode}, ${m.methodName},
                 ${m.minDays}, ${m.maxDays}, true, true, true
          WHERE NOT EXISTS (
            SELECT 1 FROM shipping_methods
            WHERE partner_id = ${partner.id}
              AND method_code = ${m.methodCode}
          )
        `;
        console.log(`  method: ${m.methodCode}`);
      }
    }

    console.log("Delivery partner catalogue seeded.");
  } finally {
    await sql.end();
  }
}

seedDeliveryPartners().catch((err: unknown) => {
  console.error("seed-delivery-partners failed:", err);
  process.exit(1);
});
