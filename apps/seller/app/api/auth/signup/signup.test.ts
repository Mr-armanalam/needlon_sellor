import * as dotenv from "dotenv";
import path from "path";
import nodemailer from "nodemailer";

// Load environment variables from .env in the project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Mock nodemailer to avoid actual SMTP connection attempt during test
nodemailer.createTransport = () => {
  return {
    sendMail: async (options: any) => {
      console.log(`- [MOCK EMAIL] OTP sent to ${options.to}`);
      return { messageId: "mock-message-id" };
    },
  } as any;
};

// Helper for Mocking Request/Response inside Route Handler
import { NextRequest } from "next/server";

async function runTests() {
  const { POST } = await import("./route");
  const { db } = await import("@/db");
  const { seller } = await import("@/db/schema/seller");
  const { eq } = await import("drizzle-orm");

  console.log("Running Backend Signup Role-based Tests...");

  const testEmailSeller = `test-seller-${Date.now()}@needlon.com`;
  const testEmailAdmin = `test-admin-${Date.now()}@needlon.com`;

  const signupPayloads = [
    {
      name: "Test Seller User",
      email: testEmailSeller,
      password: "Password123!",
      confirmPassword: "Password123!",
      role: "seller" as const,
    },
    {
      name: "Test Admin User",
      email: testEmailAdmin,
      password: "Password123!",
      confirmPassword: "Password123!",
      role: "admin" as const,
    },
  ];

  for (const payload of signupPayloads) {
    console.log(`\nTesting signup flow for role: "${payload.role}"`);

    // Create a mock NextRequest object
    const req = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const response = await POST(req as any);
    const result = await response.json();

    if (!response.ok) {
      console.error(`FAILED: Signup API responded with status ${response.status}:`, result);
      process.exit(1);
    }

    console.log("- Signup API responded with success:", result);

    // Verify database record
    const [dbUser] = await db
      .select()
      .from(seller)
      .where(eq(seller.email, payload.email))
      .limit(1);

    if (!dbUser) {
      console.error(`FAILED: User record was not found in the database for email: ${payload.email}`);
      process.exit(1);
    }

    console.log(`- Database record found. Role is: "${dbUser.role}"`);

    if (dbUser.role !== payload.role) {
      console.error(`FAILED: Expected role "${payload.role}", but database shows "${dbUser.role}"`);
      process.exit(1);
    }

    console.log(`- Role correctly verified in DB: "${dbUser.role}"`);

    // Cleanup test record
    await db.delete(seller).where(eq(seller.email, payload.email));
    console.log("- Database cleaned up successfully.");
  }

  console.log("\nALL SIGNUP TESTS PASSED SUCCESSFULLY! ✅");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test execution failed with error:", err);
  process.exit(1);
});
