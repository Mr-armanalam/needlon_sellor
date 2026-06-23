import { Role } from "@/db/schema/seller";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env in the project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function runTests() {
  const { signAccessToken, verifyAccessToken } = await import("@/modules/auth/lib/tokens");

  console.log("Running Token Role Verification Tests...");

  const rolesToTest: Role[] = ["seller", "admin"];

  for (const role of rolesToTest) {
    console.log(`\nTesting role: "${role}"`);

    const payload = {
      sub: "test-seller-id",
      email: "test@needlon.com",
      role,
    };

    // 1. Sign access token
    const token = await signAccessToken(payload);
    console.log("- Token signed successfully");

    // 2. Verify and decode token
    const decoded = await verifyAccessToken(token);

    if (!decoded) {
      console.error(`FAILED: Token verification failed for role: ${role}`);
      process.exit(1);
    }

    console.log("- Token verified successfully");

    // 3. Assert properties
    if (decoded.sub !== payload.sub) {
      console.error(`FAILED: Expected sub "${payload.sub}", got "${decoded.sub}"`);
      process.exit(1);
    }

    if (decoded.email !== payload.email) {
      console.error(`FAILED: Expected email "${payload.email}", got "${decoded.email}"`);
      process.exit(1);
    }

    if (decoded.role !== payload.role) {
      console.error(`FAILED: Expected role "${payload.role}", got "${decoded.role}"`);
      process.exit(1);
    }

    if (!decoded.jti) {
      console.error("FAILED: Expected token to contain a unique 'jti' identifier");
      process.exit(1);
    }

    console.log(`- Role "${decoded.role}" correctly verified in payload!`);
  }

  console.log("\nALL TESTS PASSED SUCCESSFULLY! ✅");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test execution failed with error:", err);
  process.exit(1);
});
