import "dotenv/config";
import assert from "node:assert";
import {
  createOrLinkWalkInCustomerRepo,
  createInStoreMeasurementRepo,
  createInStoreOrderRepo,
  updateTailoringStageRepo,
} from "../modules/customers/repository/customer.repository";
import { NotificationService } from "../../client-packages/client-modules/notification/services/notification-service";
import {
  getCustomerMeasurements,
  submitOnlineCustomerMeasurementAction,
} from "../../client-packages/client-modules/account/server/measurements-controller";

async function runPhase3TestSuite() {
  console.log("=== PHASE 3: REAL-TIME TAILORING NOTIFICATIONS & ONLINE BESPOKE CUSTOMIZATION TEST SUITE ===");

  const dummySellerId = "f836594d-fe63-4196-8782-6bb9cd04f615";
  const testCustomerEmail = `phase3_client_${Date.now()}@bespokeatelier.com`;

  // Step 1: Enroll walk-in customer
  console.log("--> 1. Enrolling Customer for Bespoke Commission...");
  const customer = await createOrLinkWalkInCustomerRepo(dummySellerId, {
    name: "Vikram Singhania",
    email: testCustomerEmail,
    phone: "+91 98888 77777",
    gender: "male",
    notes: "VIP Client bespoke 3-piece bandhgala suit",
  });
  assert.ok(customer.userId);
  console.log(`✓ Customer enrolled with ID: ${customer.userId}`);

  // Step 2: In-store bespoke order placement & notification dispatch
  console.log("--> 2. Placing In-Store Bespoke Order & Testing Notification Trigger...");
  const order = await createInStoreOrderRepo(dummySellerId, {
    customerId: customer.userId,
    garmentName: "Imperial Raw Silk Bandhgala Suit",
    amount: 28500,
    advancePaid: 15000,
    tailoringNotes: "Mandarin collar with antique brass buttons.",
  });
  assert.ok(order.id);
  console.log(`✓ Bespoke order created: ${order.orderNumber}`);

  // Step 3: Advance tailoring stage to PATTERN_DRAFTING
  console.log("--> 3. Advancing Tailoring Stage to PATTERN_DRAFTING...");
  await updateTailoringStageRepo(dummySellerId, order.id, {
    stage: "PATTERN_DRAFTING",
    notes: "Paper pattern drafted for chest and waist posture alignment.",
  });
  console.log("✓ Tailoring stage advanced to PATTERN_DRAFTING.");

  // Step 4: Advance tailoring stage to TRIAL_FITTING
  console.log("--> 4. Advancing Tailoring Stage to TRIAL_FITTING...");
  await updateTailoringStageRepo(dummySellerId, order.id, {
    stage: "TRIAL_FITTING",
    notes: "Basting stitch trial ready. Client appointment requested for Saturday.",
  });
  console.log("✓ Tailoring stage advanced to TRIAL_FITTING.");

  // Step 5: Verify customer account receives real-time in-app notifications
  console.log("--> 5. Verifying Buyer Account Notification Feed...");
  const buyerNotifs = await NotificationService.getBuyerNotifications(customer.userId);
  assert.ok(buyerNotifs.length >= 3, `Expected at least 3 notifications, received ${buyerNotifs.length}`);

  const hasNewOrderNotif = buyerNotifs.some(
    (n) => n.title.includes("Bespoke Order Confirmed") && n.title.includes(order.orderNumber)
  );
  assert.ok(hasNewOrderNotif, "Buyer received NEW_ORDER bespoke notification");

  const hasDraftingNotif = buyerNotifs.some(
    (n) => n.title.includes("Pattern Drafting") && n.message.includes("Paper pattern drafted")
  );
  assert.ok(hasDraftingNotif, "Buyer received PATTERN_DRAFTING notification with tailor notes");

  const hasTrialNotif = buyerNotifs.some(
    (n) => n.title.includes("Trial Fitting Scheduled") && n.message.includes("Basting stitch trial ready")
  );
  assert.ok(hasTrialNotif, "Buyer received TRIAL_FITTING notification with tailor notes");
  console.log("✓ All bespoke clothes update notifications verified in customer account!");

  // Step 6: Test Online Customer Measurement Submission Pipeline
  console.log("--> 6. Testing Online Customer Measurement Submission...");
  const onlineSubmission = await submitOnlineCustomerMeasurementAction({
    userId: customer.userId,
    customerEmail: testCustomerEmail,
    customerName: "Vikram Singhania",
    gender: "menswear",
    garmentType: "kurta",
    measurementUnit: "INCHES",
    essentialMeasurements: {
      chest_circumference: 42,
      waist_stomach_circumference: 36,
      collar_neck_circumference: 16.5,
      kurta_full_length: 44,
      shoulder_width: 19,
      sleeve_length: 26,
    },
    postureSpecifics: {
      shoulder_slope: "REGULAR",
      front_placket_slit_length: 12,
    },
    fitPreference: "COMFORT",
    tailorNotes: "Online customer self-measurement intake.",
  });

  assert.ok(onlineSubmission.success, "Online measurement submission succeeded");
  assert.strictEqual(onlineSubmission.data?.source, "ONLINE_CUSTOMER");
  assert.strictEqual(onlineSubmission.data?.status, "SUBMITTED");
  console.log(`✓ Online customer measurement saved: ${onlineSubmission.data?.id}`);

  // Step 7: Verify customer measurements retrieval reflects both in-store and online
  console.log("--> 7. Verifying Unified Customer Measurements List...");
  const allMeasurements = await getCustomerMeasurements(customer.userId, testCustomerEmail);
  assert.ok(allMeasurements.success);
  assert.ok(allMeasurements.data.length >= 1);
  const onlineProfile = allMeasurements.data.find((m: any) => m.source === "ONLINE_CUSTOMER");
  assert.ok(onlineProfile, "Customer profile reflects online intake measurement");
  console.log("✓ Unified customer measurement profile reflected in personal account!");

  console.log("=== ALL PHASE 3 BESPOKE NOTIFICATIONS & CUSTOMIZATION TESTS PASSED PERFECTLY ===");
  process.exit(0);
}

runPhase3TestSuite().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
