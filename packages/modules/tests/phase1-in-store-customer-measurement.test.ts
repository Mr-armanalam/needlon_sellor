import "dotenv/config";
import assert from "node:assert";
import {
  getSellerCustomersData,
  getCustomerDetailsRepo,
  createOrLinkWalkInCustomerRepo,
  createInStoreMeasurementRepo,
} from "../modules/customers/repository/customer.repository";

async function runInStoreIntakeTests() {
  console.log("=== PHASE 1: IN-STORE WALK-IN CUSTOMER & MEASUREMENT TEST SUITE ===");

  const dummySellerId = "f836594d-fe63-4196-8782-6bb9cd04f615";
  const uniqueTestEmail = `walkin_test_${Date.now()}@example.com`;

  // Step 1: Create a brand new walk-in customer
  console.log("--> Testing Walk-in Customer Creation (New User Flow)...");
  const newCustResult = await createOrLinkWalkInCustomerRepo(dummySellerId, {
    name: "Arun Master Client",
    email: uniqueTestEmail,
    phone: "+91 98765 43210",
    gender: "male",
    notes: "Walk-in client for custom wedding sherwani",
  });

  assert.ok(newCustResult.userId, "Customer userId must be generated");
  assert.strictEqual(newCustResult.email, uniqueTestEmail.toLowerCase());
  assert.strictEqual(newCustResult.isNewUser, true, "First enrollment should mark isNewUser as true");
  assert.strictEqual(newCustResult.createdInStore, true);
  console.log(`✓ New customer created and linked with ID: ${newCustResult.userId}`);

  // Step 2: Idempotent re-linking with same email (Existing User Flow)
  console.log("--> Testing Customer Account Linking for Existing Email...");
  const existingCustResult = await createOrLinkWalkInCustomerRepo(dummySellerId, {
    name: "Arun Master Client",
    email: uniqueTestEmail,
    phone: "+91 98765 43210",
    gender: "male",
    notes: "Updated note for repeat walk-in",
  });

  assert.strictEqual(existingCustResult.userId, newCustResult.userId, "Existing userId must be preserved across enrollments");
  assert.strictEqual(existingCustResult.isNewUser, false, "Existing user must not be duplicated");
  console.log("✓ Customer account unification with email validated successfully.");

  // Step 3: Verify customer appears in Seller Customer List
  console.log("--> Testing Seller Customer Directory merging...");
  const customerList = await getSellerCustomersData(dummySellerId);
  const foundInList = customerList.find(c => c.buyerId === newCustResult.userId);
  assert.ok(foundInList, "Newly enrolled walk-in customer MUST appear in seller's customer directory");
  assert.strictEqual(foundInList.buyerEmail, uniqueTestEmail.toLowerCase());
  assert.strictEqual(foundInList.isWalkIn, true);
  console.log("✓ Walk-in customer appears in seller customer list with isWalkIn=true.");

  // Step 4: Record Physical In-Store Measurement by Tailor
  console.log("--> Testing Recording In-Store Bespoke Measurement...");
  const measurementResult = await createInStoreMeasurementRepo(dummySellerId, {
    userId: newCustResult.userId,
    gender: "menswear",
    garmentType: "shirt",
    measurementUnit: "INCHES",
    essentialMeasurements: {
      neck_circumference: 16.5,
      chest_circumference: 40.0,
      waist_circumference: 34.0,
      shoulder_width: 18.0,
      sleeve_length: 33.5,
      shirt_length: 30.0,
    },
    postureSpecifics: {
      shoulder_slope: "SLOPING",
      back_curvature: "ERECT",
    },
    fitPreference: "SLIM",
    tailorNotes: "Prefers slight ease around bicep; left cuff 0.5 inch larger for watch.",
  });

  assert.ok(measurementResult.id, "Measurement record ID must be generated");
  assert.strictEqual(measurementResult.source, "IN_STORE_TAILOR_MASTER");
  assert.strictEqual(measurementResult.status, "VERIFIED");
  assert.strictEqual(measurementResult.userId, newCustResult.userId);
  console.log(`✓ Measurement record saved successfully with ID: ${measurementResult.id}`);

  // Step 5: Verify Measurement Retrieval in Customer Details
  console.log("--> Testing Measurement Retrieval in Customer Details View...");
  const details = await getCustomerDetailsRepo(dummySellerId, newCustResult.userId);
  assert.ok(Array.isArray(details.measurements));
  assert.ok(details.measurements.length >= 1, "At least 1 measurement must be retrieved");
  const latestMeasurement = details.measurements[0];
  assert.strictEqual(latestMeasurement.garmentType, "shirt");
  assert.strictEqual(latestMeasurement.source, "IN_STORE_TAILOR_MASTER");
  assert.strictEqual(latestMeasurement.status, "VERIFIED");
  assert.strictEqual(latestMeasurement.fitPreference, "SLIM");
  console.log("✓ Measurement retrieval in customer details verified successfully.");

  console.log("=== ALL PHASE 1 IN-STORE WORKFLOW TESTS PASSED PERFECTLY ===");
}

runInStoreIntakeTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
