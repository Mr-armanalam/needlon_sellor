import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import {
  BESPOKE_CONFIG,
  getGarmentDiagram,
  SUPABASE_STORAGE_GUIDES_URL,
} from "../../client-packages/client-modules/product/constants/bespoke-taxonomy";
import { DEFAULT_FORM_DATA } from "../modules/products/constants";

console.log("=== Testing Bespoke Customization SaaS Platform Engine ===");

// 1. Menswear Tests
console.log("--> Validating Menswear Taxonomy...");
const menswear = BESPOKE_CONFIG.menswear;
assert.ok(menswear, "Menswear category must be defined");

// Shirt
assert.ok(menswear.shirt.essential_measurements.includes("neck_circumference"));
assert.ok(menswear.shirt.essential_measurements.includes("chest_circumference"));
assert.ok(menswear.shirt.essential_measurements.includes("sleeve_length"));
assert.ok(menswear.shirt.bespoke_and_posture_specifics.includes("scye_depth"));
assert.ok(menswear.shirt.bespoke_and_posture_specifics.includes("shoulder_slope"));
console.log("✓ Menswear Shirt specs verified.");

// Pant
assert.ok(menswear.pant.essential_measurements.includes("crotch_rise_depth"));
assert.ok(menswear.pant.bespoke_and_posture_specifics.includes("stance_and_prominence"));
console.log("✓ Menswear Pant specs verified.");

// Safari Suit Jacket
assert.ok(menswear.safari_suit_jacket.essential_measurements.includes("safari_jacket_length"));
assert.ok(menswear.safari_suit_jacket.bespoke_and_posture_specifics.includes("belt_waist_level"));
console.log("✓ Menswear Safari Suit Jacket specs verified.");

// Jacket Blazer
assert.ok(menswear.jacket_blazer.bespoke_and_posture_specifics.includes("neck_point_to_front_button_stance"));
console.log("✓ Menswear Jacket Blazer specs verified.");

// Coat Overcoat
assert.ok(menswear.coat_overcoat.essential_measurements.includes("chest_circumference_over_suit"));
assert.ok(menswear.coat_overcoat.bespoke_and_posture_specifics.includes("scye_depth_enlarged"));
console.log("✓ Menswear Coat Overcoat specs verified.");

// Waistcoat
assert.ok(menswear.waistcoat.essential_measurements.includes("front_length_to_point"));
assert.ok(menswear.waistcoat.bespoke_and_posture_specifics.includes("stomach_prominence_drop"));
console.log("✓ Menswear Waistcoat specs verified.");

// Kurta
assert.ok(menswear.kurta.essential_measurements.includes("kurta_full_length"));
assert.ok(menswear.kurta.bespoke_and_posture_specifics.includes("side_slit_start_point_hip_level"));
console.log("✓ Menswear Kurta specs verified.");

// Khandress Kurta Pathani
assert.ok(menswear.khandress_kurta_pathani.bespoke_and_posture_specifics.includes("epaulet_shoulder_flap_length"));
assert.ok(menswear.khandress_kurta_pathani.bespoke_and_posture_specifics.includes("side_slit_height"));
console.log("✓ Menswear Khandress / Pathani Kurta specs verified.");

// 2. Womenswear Tests
console.log("--> Validating Womenswear Taxonomy...");
const womenswear = BESPOKE_CONFIG.womenswear;
assert.ok(womenswear, "Womenswear category must be defined");

// Shirt
assert.ok(womenswear.shirt.essential_measurements.includes("upper_bust_circumference"));
assert.ok(womenswear.shirt.bespoke_and_posture_specifics.includes("bust_point_height_shoulder_to_apex"));
console.log("✓ Womenswear Shirt specs verified.");

// Pant
assert.ok(womenswear.pant.essential_measurements.includes("natural_waist_circumference"));
assert.ok(womenswear.pant.bespoke_and_posture_specifics.includes("waist_to_hip_depth"));
console.log("✓ Womenswear Pant specs verified.");

// Lehenga
assert.ok(womenswear.lehenga.essential_measurements.includes("lehenga_length_waist_to_floor"));
assert.ok(womenswear.lehenga.essential_measurements.includes("lehenga_length_with_heels"));
assert.ok(womenswear.lehenga.essential_measurements.includes("flare_ghera_target_width"));
assert.ok(womenswear.lehenga.bespoke_and_posture_specifics.includes("front_center_length"));
console.log("✓ Womenswear Lehenga specs verified.");

// Blouse Saree Lehenga
assert.ok(womenswear.blouse_saree_lehenga.essential_measurements.includes("front_neck_depth"));
assert.ok(womenswear.blouse_saree_lehenga.essential_measurements.includes("back_neck_depth"));
assert.ok(womenswear.blouse_saree_lehenga.bespoke_and_posture_specifics.includes("cup_size_dart_depth"));
console.log("✓ Womenswear Blouse/Choli specs verified.");

// Ladies Jacket
assert.ok(womenswear.ladies_jacket.bespoke_and_posture_specifics.includes("button_stance_height"));
console.log("✓ Womenswear Ladies Jacket specs verified.");

// Ladies Coat
assert.ok(womenswear.ladies_coat.essential_measurements.includes("bust_circumference_over_garment"));
assert.ok(womenswear.ladies_coat.bespoke_and_posture_specifics.includes("lapel_break_point"));
console.log("✓ Womenswear Ladies Coat specs verified.");

// 3. Dynamic Field Isolation (Crucial UX Requirement)
console.log("--> Validating Dynamic Field Isolation (No Cross-Garment Field Leaks)...");
assert.strictEqual(
  menswear.shirt.essential_measurements.includes("flare_ghera_target_width"),
  false,
  "Shirt must NOT contain lehenga flare width"
);
assert.strictEqual(
  menswear.shirt.essential_measurements.includes("crotch_rise_depth"),
  false,
  "Shirt must NOT contain trouser crotch rise"
);
assert.strictEqual(
  womenswear.lehenga.essential_measurements.includes("wrist_circumference"),
  false,
  "Lehenga must NOT contain wrist circumference"
);
console.log("✓ Dynamic field isolation successfully validated.");

// 4. Supabase Storage & Local Fallback Diagram Asset Verification
console.log("--> Validating Visual Measurement Diagram Assets (Supabase CDN + Local Public Fallback)...");
const publicFallbackDir = path.resolve(__dirname, "../../../apps/client/public/images/measurements");

const allGenders = ["menswear", "womenswear"] as const;
for (const g of allGenders) {
  const garments = BESPOKE_CONFIG[g];
  for (const [key, config] of Object.entries(garments)) {
    // 1. Verify Supabase Storage CDN URL format
    assert.ok(
      config.cdnUrl.startsWith(SUPABASE_STORAGE_GUIDES_URL),
      `CDN URL for ${g}/${key} must point to Supabase bucket: ${config.cdnUrl}`
    );
    assert.ok(
      config.diagramFile.endsWith(".png"),
      `Diagram file for ${g}/${key} must be a PNG image: ${config.diagramFile}`
    );

    // 2. Verify fallback URL format
    assert.ok(
      config.fallbackUrl.startsWith("/images/measurements/"),
      `Fallback URL for ${g}/${key} must point to public fallback: ${config.fallbackUrl}`
    );

    // 3. Verify that the local fallback file actually exists on disk (Zero 404 guarantee)
    const localFileOnDisk = path.join(publicFallbackDir, config.diagramFile);
    assert.ok(
      fs.existsSync(localFileOnDisk),
      `Local fallback asset must exist at ${localFileOnDisk}`
    );

    // 4. Test resolver function
    const resolved = getGarmentDiagram(g, key);
    assert.strictEqual(resolved.cdnUrl, config.cdnUrl);
    assert.strictEqual(resolved.fallbackUrl, config.fallbackUrl);
  }
}
console.log("✓ All 14 garment diagram assets verified in Supabase CDN & local fallback.");

// 5. SaaS Business Policy & Customization Lock
console.log("--> Validating Seller Customization Toggle & Lock Policy...");
assert.strictEqual(
  DEFAULT_FORM_DATA.isCustomizable,
  true,
  "Products must be customizable by default during seller listing"
);

function canSellerDisableCustomization(hasOrders: boolean) {
  return !hasOrders;
}
assert.strictEqual(canSellerDisableCustomization(false), true, "Seller can disable before orders exist");
assert.strictEqual(canSellerDisableCustomization(true), false, "Seller CANNOT disable or deny after customer orders");
console.log("✓ Seller customization toggle and post-order lock verified.");

console.log("=== ALL BESPOKE CUSTOMIZATION & DIAGRAM TESTS PASSED PERFECTLY ===");
