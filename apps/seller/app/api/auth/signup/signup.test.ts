import * as dotenv from "dotenv";
import path from "path";
import nodemailer from "nodemailer";

// Load environment variables from .env in the project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Mock nodemailer to avoid actual SMTP connection attempt during test.
// The mock only implements the sendMail surface the auth mailer uses, so it
// is bridged to the overloaded createTransport type with a single cast.
const mockTransporter = {
  sendMail: async (options: nodemailer.SendMailOptions) => {
    console.log(`- [MOCK EMAIL] OTP sent to ${options.to}`);
    return { messageId: "mock-message-id" };
  },
};

nodemailer.createTransport = (() =>
  mockTransporter) as unknown as typeof nodemailer.createTransport;

// Helper for Mocking Request/Response inside Route Handler
import { NextRequest } from "next/server";

async function runTests() {
  const { POST } = await import("./route");
  const { db } = await import("@/db");
  const { seller } = await import("@/db/schema/seller");
  const { eq } = await import("drizzle-orm");

  console.log("Running Backend Signup Role-Safety Tests...");

  // Security contract: public signup must NEVER honour a role supplied in
  // the request body. Every payload below — including the one attempting
  // role: "admin" — must land in the database as a plain "seller".
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
      name: "Test Admin Escalation Attempt",
      email: testEmailAdmin,
      password: "Password123!",
      confirmPassword: "Password123!",
      role: "admin" as const,
    },
  ];

  for (const payload of signupPayloads) {
    console.log(`\nTesting signup flow with submitted role: "${payload.role}" (must be stored as "seller")`);

    // Create a mock NextRequest object
    const req = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const response = await POST(req);
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

    if (dbUser.role !== "seller") {
      console.error(`FAILED: Expected stored role "seller" regardless of submitted role "${payload.role}", but database shows "${dbUser.role}"`);
      process.exit(1);
    }

    console.log(`- Role escalation blocked; stored role verified in DB: "${dbUser.role}"`);

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
