import "dotenv/config";
import { compare, hash } from "bcryptjs";
import { updateSellerSettingsSchema } from "@/modules/seller-profile/validations/update-seller-settings-schema";
import { SELLER_THEMES } from "@/modules/seller-profile/constants";
import { 
  SUPPORTED_LANGUAGES, 
  SUPPORTED_CURRENCIES, 
  SUPPORTED_TIMEZONES 
} from "./hooks/use-seller-settings";

async function runSettingsModuleTests() {
  console.log("🚀 Starting Settings Module Unit & Integration Tests...");

  // Test 1: Supported Localization Catalogs
  console.log("👉 Test 1: Verifying Localization Catalogs...");
  if (SUPPORTED_LANGUAGES.length < 5) {
    throw new Error("Missing supported languages catalog");
  }
  if (!SUPPORTED_LANGUAGES.some((l) => l.code === "en")) {
    throw new Error("Default English language missing from catalog");
  }
  if (!SUPPORTED_CURRENCIES.some((c) => c.code === "INR")) {
    throw new Error("Default INR currency missing from catalog");
  }
  if (!SUPPORTED_TIMEZONES.some((t) => t.value === "Asia/Kolkata")) {
    throw new Error("Default Asia/Kolkata timezone missing from catalog");
  }
  console.log("   ✅ Localization options verified.");

  // Test 2: Validation of Seller Settings Schema
  console.log("👉 Test 2: Validating Full Settings Schema...");
  const validPayload = {
    languageCode: "en",
    currencyCode: "INR",
    timezone: "Asia/Kolkata",
    theme: "SYSTEM" as const,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    marketingNotifications: false,
    orderNotifications: true,
    payoutNotifications: true,
    lowInventoryNotifications: true,
  };
  const parsed = updateSellerSettingsSchema.safeParse(validPayload);
  if (!parsed.success) {
    throw new Error(`Valid settings failed schema parse: ${JSON.stringify(parsed.error)}`);
  }
  console.log("   ✅ Valid settings schema successfully parsed.");

  // Test 3: Partial Schema validation
  console.log("👉 Test 3: Validating Partial Settings Schema for PATCH...");
  const partialParsed = updateSellerSettingsSchema.partial().safeParse({
    languageCode: "fr",
    theme: "DARK",
  });
  if (!partialParsed.success) {
    throw new Error(`Partial settings failed parse: ${JSON.stringify(partialParsed.error)}`);
  }
  console.log("   ✅ Partial settings schema successfully parsed.");

  // Test 4: Reject Invalid Enum Theme
  console.log("👉 Test 4: Rejecting Invalid Themes...");
  const invalidThemeParsed = updateSellerSettingsSchema.safeParse({
    ...validPayload,
    theme: "NEON_VAPORWAVE" as any,
  });
  if (invalidThemeParsed.success) {
    throw new Error("Invalid theme was unexpectedly allowed by schema");
  }
  console.log("   ✅ Invalid theme correctly rejected.");

  // Test 5: Password Hashing & Verification
  console.log("👉 Test 5: Testing Password Cryptographic Hashing...");
  const rawPassword = "SecurePassword@2026!";
  const wrongPassword = "WrongPassword#123";
  const hashedPassword = await hash(rawPassword, 10);

  const isMatch = await compare(rawPassword, hashedPassword);
  if (!isMatch) {
    throw new Error("Valid password failed bcrypt match");
  }

  const isWrongMatch = await compare(wrongPassword, hashedPassword);
  if (isWrongMatch) {
    throw new Error("Wrong password unexpectedly passed bcrypt match");
  }
  console.log("   ✅ Bcrypt password hashing & validation verified.");

  console.log("\n🎉 All 5 Settings Module Tests Passed Successfully!");
}

runSettingsModuleTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Settings Module Tests Failed:", err);
    process.exit(1);
  });
