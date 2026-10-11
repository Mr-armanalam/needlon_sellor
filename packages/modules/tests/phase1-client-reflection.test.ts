import "dotenv/config";
import assert from "node:assert";
import {
  createOrLinkWalkInCustomerRepo,
  createInStoreMeasurementRepo,
} from "../modules/customers/repository/customer.repository";
import { getCustomerMeasurements } from "../../client-packages/client-modules/account/server/measurements-controller";

async function runClientReflectionTest() {
  console.log("=== PHASE 1: CLIENT ACCOUNT MEASUREMENT REFLECTION TEST ===");

  const dummySellerId = "f836594d-fe63-4196-8782-6bb9cd04f615";
  const clientEmail = `client_reflection_${Date.now()}@testdomain.com`;

  // 1. Tailor shop creates customer
  console.log("--> Step 1: Tailor shop creates walk-in customer with email:", clientEmail);
  const created = await createOrLinkWalkInCustomerRepo(dummySellerId, {
    name: "Vikram Sharma",
    email: clientEmail,
    phone: "+91 99887 76655",
    gender: "male",
    notes: "Fitting for 2 bespoke suits",
  });
  assert.ok(created.userId);

  // 2. Tailor shop records measurement
  console.log("--> Step 2: Tailor shop records physical measurements in store...");
  const recorded = await createInStoreMeasurementRepo(dummySellerId, {
    userId: created.userId,
    gender: "menswear",
    garmentType: "blazer",
    measurementUnit: "INCHES",
    essentialMeasurements: {
      chest_circumference: 42.0,
      waist_circumference: 36.0,
      shoulder_width: 19.0,
      sleeve_length: 34.0,
      jacket_length: 31.0,
    },
    fitPreference: "REGULAR",
    tailorNotes: "Slight padding on right shoulder",
  });
  assert.ok(recorded.id);

  // 3. Customer logs in to client app with the same email
  console.log("--> Step 3: Customer logs into personal account in client app with that same email...");
  const clientResponse = await getCustomerMeasurements(created.userId, clientEmail);

  assert.strictEqual(clientResponse.success, true);
  assert.ok(Array.isArray(clientResponse.data));
  assert.ok(clientResponse.data.length >= 1, "Customer must see at least 1 measurement in personal account");

  const matchingMeasurement = clientResponse.data.find(m => m.id === recorded.id);
  assert.ok(matchingMeasurement, "The in-store measurement recorded by tailor MUST appear in customer account");
  assert.strictEqual(matchingMeasurement.garmentType, "blazer");
  assert.strictEqual(matchingMeasurement.source, "IN_STORE_TAILOR_MASTER");
  assert.strictEqual(matchingMeasurement.status, "VERIFIED");
  assert.strictEqual(matchingMeasurement.fitPreference, "REGULAR");
  assert.strictEqual(matchingMeasurement.tailorNotes, "Slight padding on right shoulder");

  console.log("✓ In-store measurements reflected flawlessly in customer's personal account!");
  console.log("=== ALL CLIENT REFLECTION TESTS PASSED PERFECTLY ===");
}

runClientReflectionTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
